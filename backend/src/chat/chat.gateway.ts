import { UseGuards } from '@nestjs/common';
import { validate } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationService } from './Queries/conversation.service';
import { ParticipantService } from './Queries/participant.service';
import { MessageService } from './Queries/message.service';
import { Participant, Privacy, Role, Status } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { GatewaySessionManager } from './gateway.session';
import { UsersService } from '../users/users.service';
import { sendMessageDto } from './dto/GatewayDTO/sendMessage.dto';
import { createConversationDto } from './dto/GatewayDTO/createConversation.dto';
import { joinConversationDto } from './dto/GatewayDTO/joinConversation.dto';
import { DirectMessageDTO } from './dto/GatewayDTO/directMessage.dto';
import { LeaveConversationDTO } from './dto/GatewayDTO/leaveConversation.dto';
import { AddPasswordDTO } from './dto/GatewayDTO/addPassword.dto';
import { MakeAdminDTO } from './dto/GatewayDTO/makeAdmin.dto';
import { AddParticipantDTO } from './dto/GatewayDTO/addParticipant.dto';
import { RemoveParticipantDTO } from './dto/GatewayDTO/removeParticipant.dto';
import { BanUserDTO } from './dto/GatewayDTO/banUser.dto';
import { UnBanUserDTO } from './dto/GatewayDTO/unBanUser.dto';
import { KickUserDTO } from './dto/GatewayDTO/kickUser.dto';
import { MuteUserDTO } from './dto/GatewayDTO/muteUser.dto';

@WebSocketGateway(8001, {
  cors: {
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true,
  },
})
// @WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private gatewaySession: GatewaySessionManager,
    private conversationService: ConversationService,
    private participantService: ParticipantService,
    private messageService: MessageService,
    // usePipes(new ValidationPipe()),
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token as string;
    // const token = client.handshake.headers.token as string;
    const userID = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    client.data.userID = userID;

    this.gatewaySession.setUserSocket(userID.id, client);

    console.log('User connected chat: ', userID);

    const conversations =
      await this.conversationService.getConversationByUserID(userID.id);

    for (const conversation of conversations) {
      client.join(conversation.id);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected: ', client.data.userID);
    this.gatewaySession.removeUserSocket(client.data.userID.id);
  }

  @SubscribeMessage('createConversation')
  async createConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: createConversationDto,
  ) {
    console.log('In createConversation');
    try {
      await this.createConversationValidation(data);

      const errors = await validate(data);
      console.log(errors)
      if (errors.length > 0) {
        // If there are any validation errors, throw a WsException with the first error message
        throw new WsException({
          message: 'Create conversation failed',
          error: errors[0].toString(),
        });
      }

      const conversation = await this.conversationService.createConversation({
        title: data.title,
        creator_id: client.data.userID.id,
        password: data.password,
        privacy: data.privacy,
      });

      // add only one participant
      const participant =
        await this.participantService.addParticipantToConversation(
          {
            conversation_id: conversation.id,
            user_id: client.data.userID.id,
            role: Role['OWNER'],
            conversation_status: 'ACTIVE',
          }
        );

      await this.joinConversations(client.data.userID.id, conversation.id);
      await this.sendConversationCreatedToAllClients(
        client.data.userID.id,
        conversation,
      );
    }
    catch (e) {
      console.log(e);
      throw new WsException({
        message: 'Create conversation failed',
        error: e.message
      });
    }
  }

  @SubscribeMessage('joinConversation')
  async joinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: joinConversationDto,
  ) {
    console.log('In joinConversation');

    try {
      await this.joinConversationValidation(data, client.data.userID.id);

      const participant =
        await this.participantService.addParticipantToConversation(
          {
            conversation_id: data.conversationID,
            user_id: client.data.userID.id,
            role: Role.USER,
            conversation_status: 'ACTIVE',
          }
        );

      await this.joinConversations(client.data.userID.id, data.conversationID);
      this.server.to(data.conversationID).emit('conversationJoined', {
        conversationID: data.conversationID,
        leftUserID: client.data.userID.id,
      });
    }
    catch (e) {
      console.log(e);
      throw new WsException({
        message: 'Join conversation failed',
        error: e.message
      });
    }
  }

  @SubscribeMessage('directMessage')
  async directMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: DirectMessageDTO,
  ) {
    console.log('In directMessage');
    try {
      await this.conversationService.checkDirectConversationExists(
        client.data.userID.id,
        data.userID,
      );

      const conversation =
        await this.conversationService.createDirectConversation(
          {
            title: data.title,
            creator_id: client.data.userID.id,
            privacy: 'DIRECT',
          },
          client.data.userID.id,
          data.userID,
        );

      await this.joinConversations(client.data.userID.id, conversation.id);
      await this.joinConversations(data.userID, conversation.id);
      client.emit('directMessage', conversation);
    }
    catch (e) {
      throw new WsException({
        message: 'Direct conversation failed',
        error: e.message
      });
    }
  }

  @SubscribeMessage('leaveConversation')
  async leaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: LeaveConversationDTO,
  ) {
    try {
      await this.leaveConversationValidation(data, client.data.userID.id);

      const removedParticipant =
        await this.participantService.removeParticipantFromConversation(
          data.conversationID,
          client.data.userID.id,
        );

      await this.conversationService.promoteOldestUserToAdmin(
        data.conversationID,
      );

      const user = this.gatewaySession.getUserSocket(client.data.userID.id);
      if (!user) return;
      this.server.to(data.conversationID).emit('conversationLeft', {
        conversationID: data.conversationID,
        leftUserID: client.data.userID.id,
      });
      user.leave(data.conversationID);
    }
    catch (e) {
      console.log(e);
      throw new WsException({
        message: 'Leave conversation failed',
        error: e.message
      });
    }
  }

  @SubscribeMessage('addPassword')
  async protectRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: AddPasswordDTO,
  ) {
    try {
      const conversation = await this.conversationService.protectConversation(
        data.conversationID,
        data.password,
        client.data.userID.id,
      );

      this.server
        .to(data.conversationID)
        .emit('conversationProtected', conversation.id);
    }
    catch (e) {
      throw new WsException({
        message: 'Add Password failed',
        error: e.message
      });
    }
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: sendMessageDto,
  ) {
    console.log('In sendMessage', data);
    try {
      const participant =
        await this.participantService.findParticipantByUserIDandConversationID(
          client.data.userID.id,
          data.conversationID,
        );

      if (!participant)
        throw new Error('Participant not found');

      if (participant.conversation_status === Status.MUTED) {
        const currentTime = new Date();
        if (currentTime > participant.mute_expires_at)
          await this.conversationService.unmuteUser(
            data.conversationID,
            client.data.userID.id,
          );
        throw new Error('You are muted');
      }

      const message = await this.messageService.createMessage({
        message: data.message,
        author_id: participant.id,
        conversation_id: data.conversationID,
      },
	  client.data.userID.id,
	  );

      this.server.to(data.conversationID).emit('messageCreated', message);
    }
    catch (e) {
		console.log(e)
      throw new WsException({
        message: 'Send Message failed',
        error: e.message
      });
    }
  }

  @SubscribeMessage('makeAdmin')
  async makeAdmin(@ConnectedSocket() client: Socket, @MessageBody() data: MakeAdminDTO) {
    try {
      const participant = await this.participantService.makeParticipantAdmin(
        data.conversationID,
        data.userID,
        client.data.userID.id,
      );

      this.server.to(data.conversationID).emit('adminMade', {
        conversationID: data.conversationID,
        admin: participant.user_id,
      });
    }
    catch (e) {
      throw new WsException({
        message: 'Make Admin failed',
        error: e.message
      });
    }
  }

  @SubscribeMessage('addParticipant')
  async addParticipant(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: AddParticipantDTO,
  ) {
    console.log('In addParticipant');

    try {
      const check = await this.addRemoveParticipantValidation(data, client.data.userID.id, 'Added');

      if (check) {
        if (check && check.conversation_status === Status.ACTIVE)
          throw new Error('User already in conversation');

        if (check.conversation_status === Status.BANNED)
          throw new Error('User is banned from conversation');
      }

      const participant =
        await this.participantService.addParticipantToConversation(
          {
            conversation_id: data.conversationID,
            user_id: data.userID,
            role: Role.USER,
            conversation_status: 'ACTIVE',
          }
        );

      this.joinConversations(data.userID, data.conversationID);
      this.server.to(data.conversationID).emit('participantAdded', {
        conversationID: data.conversationID,
        participant: participant.user_id,
      });
    }
    catch (e) {
      console.log(e);
      throw new WsException({
        message: 'Add Participant failed',
        error: e.message
      });
    }
  }

  @SubscribeMessage('removeParticipant')
  async removeParticipant(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: RemoveParticipantDTO,
  ) {
    console.log('In removeParticipant');

    try {
      const check = await this.addRemoveParticipantValidation(data, client.data.userID.id, 'REMOVE');

      if (!check)
        throw new Error('User not in conversation');

      if (check.conversation_status === 'BANNED')
        throw new Error('User is banned');

      if (check.conversation_status !== Status.ACTIVE)
        throw new Error('User is not in conversation');

      if (check.role === Role.OWNER)
        throw new Error('User is channel Owner.');

      const participant =
        await this.participantService.removeParticipantFromConversation(
          data.conversationID,
          data.userID,
          client.data.userID.id,
        );

      await this.conversationService.promoteOldestUserToAdmin(
        data.conversationID,
      );

      const user = this.gatewaySession.getUserSocket(data.userID);
      if (!user) return;
      user.leave(data.conversationID);
      this.server.to(data.conversationID).emit('participantRemoved', {
        conversationID: data.conversationID,
        removedUserID: participant.user_id,
      });
    }
    catch (e) {
      throw new WsException({
        message: 'Remove Participant failed',
        error: e.message
      });
    }
  }

  @SubscribeMessage('banUser')
  async banUser(@ConnectedSocket() client: Socket, @MessageBody() data: BanUserDTO) {
    try {
      console.log('In banUser');

      await this.banUserValidation(data, client.data.userID.id);

      const participant = await this.participantService.updateParticipantStatus(
        data.conversationID,
        data.userID,
        Status.BANNED,
      );

      const user = this.gatewaySession.getUserSocket(data.userID);
      if (!user) return;
      this.server.to(data.conversationID).emit('userBanned', {
        conversationID: data.conversationID,
        bannedUserID: participant.user_id,
      });
      user.leave(data.conversationID);
    } catch (e) {
      throw new WsException({
        message: 'Ban User failed',
        error: e.message
      });
    }
  }

  @SubscribeMessage('unbanUser')
  async unbanUser(@ConnectedSocket() client: Socket, @MessageBody() data: UnBanUserDTO) {
    try {
      console.log('In unbanUser');

      await this.unbanUserValidation(data, client.data.userID.id);

      const participant = await this.participantService.updateParticipantStatus(
        data.conversationID,
        data.userID,
        Status.ACTIVE,
      );

      this.joinConversations(data.userID, data.conversationID);
      this.server.to(data.conversationID).emit('userUnbanned', {
        conversationID: data.conversationID,
        unbannedUserID: participant.user_id,
      });
    } catch (e) {
      throw new WsException({
        message: 'Unban User failed',
        error: e.message
      });
    }
  }

  @SubscribeMessage('removePassword')
  async removePassword(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      console.log('In removePassword');

      await this.removePasswordValidation(data, client.data.userID.id);

      const conversation =
        await this.conversationService.removePasswordFromConversation(
          data.conversationID,
        );

      this.server.to(data.conversationID).emit('passwordRemoved');
    } catch (e) {
      throw new WsException({
        message: 'Remove Password failed',
        error: e.message
      });
    }
  }

  @SubscribeMessage('muteUser')
  async muteUser(@ConnectedSocket() client: Socket, @MessageBody() data: MuteUserDTO) {
    try {
      const muteDuration: number = 1;
      const conversation = await this.conversationService.muteUser(
        data.conversationID,
        data.userID,
        muteDuration,
        client.data.userID.id);

      this.server.to(data.conversationID).emit('userMuted', {
        conversationID: data.conversationID,
        mutedUserID: data.userID,
      });
    } catch (e) {
      throw new WsException({
        message: 'Mute User failed',
        error: e.message
      });
    }
  }

  // helper function

  private async joinConversations(userID: string, conversationID: string) {
    const user = this.gatewaySession.getUserSocket(userID);

    if (!user) return;
    user.join(conversationID);
  }

  private async sendConversationCreatedToAllClients(
    userID: string,
    conversation: any,
  ) {
    if (conversation.privacy === 'private') {
      const client = this.gatewaySession.getUserSocket(userID);
      if (!client) return;
      this.server.to(client.id).emit('conversationCreated', conversation);
      return;
    }
    const sockets = this.gatewaySession.getAllUserSockets();
    if (!sockets || sockets.length === 0) return;
    sockets.forEach(socket => {
      this.server.to(socket.id).emit('conversationCreated', conversation);
    });
    this.server.emit('conversationCreated', conversation);
  }

  // private async sendConversationJoinedToAllClients(
  //   userID: string,
  //   conversationID: string,
  // ) {
  //   const conversations = await this.conversationService.getConversationByID(
  //     conversationID,
  //   );

  //   const participants = conversations.participants;
  //   participants.forEach(async participant => {
  //     const messages = await this.messageService.getMessagesByConversationID(
  //       conversationID,
  //     );
  //     const sockets = this.gatewaySession.getAllUserSockets();
  //     if (!sockets || sockets.length === 0) return;
  //     sockets.forEach(socket => {
  //       this.server.to(socket.id).emit('conversationJoined', {
  //         conversationID,
  //         participant,
  //         messages,
  //       });
  //     });
  //   });
  // }

  // validations

  private async createConversationValidation(
    data: createConversationDto,
  ): Promise<boolean> {
    if (!Object.values(Privacy).includes(data.privacy as Privacy)) {
      throw new Error('Privacy is invalid or not provided');
    }

    if (data.privacy === Privacy.PROTECTED || data.privacy === Privacy.PRIVATE) {
      if (!data.password) {
        throw new Error('Password is required to protect the conversations');
      }

      const regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
      if (!regex.test(data.password)) {
        throw new Error('Password is invalid');
      }
    }

    if (!data.title || data.title.trim() === '') {
      throw new Error('Title is required');
    }

    if ((await this.conversationService.validateChannelTitle(data.title) === false)) {
      throw new Error('Title is invalid');
    }

    return true;
  }

  async joinConversationValidation(
    data: joinConversationDto,
    user: string,
  ): Promise<boolean> {
    if (data.conversationID == '' || data.conversationID == null || data.conversationID == undefined)
      throw new Error('Conversation ID is required');

    const conversation = await this.conversationService.checkConversationExists(
      data.conversationID,
    );

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error('You cannot join a direct conversation');

    if (conversation.privacy === Privacy.PRIVATE)
      throw new Error('You cannot join a private conversation.');

    const participant = await this.participantService.checkParticipantExists(
      data.conversationID,
      user,
    );

    if (participant) {
      if (participant.conversation_status === Status.BANNED)
        throw new Error('You are banned from this conversation');

      if (participant.conversation_status === Status.ACTIVE || participant.conversation_status === Status.MUTED)
        throw new Error('You are already in this conversation');
    }

    if (conversation.privacy === Privacy.PROTECTED) {
      if (data.password == '' || data.password == null || data.password == undefined)
        throw new Error('Password is incorrect');

      if (await this.conversationService.validatePassword(data.password, conversation.password) === false)
        throw new Error('Password is incorrect');
    }

    return true;
  }

  async leaveConversationValidation(
    data: LeaveConversationDTO,
    user: string,
  ): Promise<boolean> {
    if (data.conversationID == '' || data.conversationID == null || data.conversationID == undefined)
      throw new Error('Conversation ID is required');

    const conversation = await this.conversationService.checkConversationExists(
      data.conversationID,
    );

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error('You cannot leave a direct conversation');

    const participant = await this.participantService.checkParticipantExists(
      data.conversationID,
      user,
    );

    if (!participant)
      throw new Error('You are not in this conversation');

    if (participant.conversation_status !== Status.ACTIVE)
      throw new Error('You are not in this conversation');

    return true;
  }

  async addRemoveParticipantValidation(
    data: AddParticipantDTO,
    user: string,
    event: string,
  ): Promise<Participant> {
    if (data.conversationID == '' || data.conversationID == null || data.conversationID == undefined)
      throw new Error('Conversation ID is required');

    if (data.userID == '' || data.userID == null || data.userID == undefined)
      throw new Error('Participant ID is required');

    const conversation = await this.conversationService.checkConversationExists(
      data.conversationID,
    );

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error(`You cannot ${event} participants from a direct conversation`);

    const participant = await this.participantService.checkParticipantExists(
      data.conversationID,
      user,
    );

    if (!participant || participant.conversation_status !== Status.ACTIVE)
      throw new Error('You are not in this conversation');

    if (participant.role === Role.USER)
      throw new Error('You are not an admin of this conversation');

    const userExists = await this.participantService.checkParticipantExists(data.conversationID, data.userID);

    return userExists;
  }

  async banUserValidation(
    data: BanUserDTO,
    user: string,
  ): Promise<boolean> {
    if (data.conversationID == '' || data.conversationID == null || data.conversationID == undefined)
      throw new Error('Conversation ID is required');

    if (data.userID == '' || data.userID == null || data.userID == undefined)
      throw new Error('Participant ID is required');

    const conversation = await this.conversationService.checkConversationExists(
      data.conversationID,
    );

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error('You cannot ban participants from a direct conversation');

    const participant = await this.participantService.checkParticipantExists(
      data.conversationID,
      user,
    );

    if (!participant || participant.conversation_status !== Status.ACTIVE)
      throw new Error('You are not in this conversation');

    if (participant.role === Role.USER)
      throw new Error('You are not an admin of this conversation');

    const userExists = await this.participantService.checkParticipantExists(data.conversationID, data.userID);

    if (!userExists)
      throw new Error('Participant does not exist');

    if (userExists.role !== Role.OWNER)
      throw new Error('You cannot ban an owner');

    if (userExists.conversation_status === Status.BANNED)
      throw new Error('Participant is already banned');

    if (userExists.conversation_status !== Status.ACTIVE)
      throw new Error('Participant is not part of this conversation');

    return true;
  }

  async unbanUserValidation(
    data: UnBanUserDTO,
    user: string,
  ): Promise<boolean> {
    if (data.conversationID == '' || data.conversationID == null || data.conversationID == undefined)
      throw new Error('Conversation ID is required');

    if (data.userID == '' || data.userID == null || data.userID == undefined)
      throw new Error('Participant ID is required');

    const conversation = await this.conversationService.checkConversationExists(
      data.conversationID,
    );

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error('You cannot unban participants from a direct conversation');

    const participant = await this.participantService.checkParticipantExists(
      data.conversationID,
      user,
    );

    if (!participant || participant.conversation_status !== Status.ACTIVE)
      throw new Error('You are not in this conversation');

    if (participant.role === Role.USER)
      throw new Error('You are not an admin of this conversation');

    const userExists = await this.participantService.checkParticipantExists(data.conversationID, data.userID);

    if (!userExists)
      throw new Error('Participant does not exist');

    if (userExists.conversation_status !== Status.BANNED)
      throw new Error('Participant is not banned');

    return true;
  }

  async kickUserValidation(
    data: KickUserDTO,
    user: string,
  ): Promise<boolean> {
    if (data.conversationID == '' || data.conversationID == null || data.conversationID == undefined)
      throw new Error('Conversation ID is required');

    if (data.userID == '' || data.userID == null || data.userID == undefined)
      throw new Error('Participant ID is required');

    const conversation = await this.conversationService.checkConversationExists(
      data.conversationID,
    );

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error('You cannot kick participants from a direct conversation');

    const participant = await this.participantService.checkParticipantExists(
      data.conversationID,
      user,
    );

    if (!participant || participant.conversation_status !== Status.ACTIVE)
      throw new Error('You are not in this conversation');

    if (participant.role === Role.USER)
      throw new Error('You are not an admin of this conversation');

    const userExists = await this.participantService.checkParticipantExists(data.conversationID, data.userID);

    if (!userExists)
      throw new Error('Participant does not exist');

    if (userExists.role === Role.ADMIN)
      throw new Error('You cannot kick an admin');

    if (userExists.conversation_status !== Status.ACTIVE)
      throw new Error('Participant is not part of this conversation');

    return true;
  }

  async removePasswordValidation(
    data: any,
    user: string,
  ): Promise<boolean> {
    if (data.conversationID == '' || data.conversationID == null || data.conversationID == undefined)
      throw new Error('Conversation ID is required');

    const conversation = await this.conversationService.checkConversationExists(
      data.conversationID,
    );

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error('You cannot remove password from a direct conversation');

    if (conversation.privacy === Privacy.PUBLIC)
      throw new Error('This conversation does not have a password');

    const participant = await this.participantService.checkParticipantExists(
      data.conversationID,
      user,
    );

    if (!participant || participant.conversation_status !== Status.ACTIVE)
      throw new Error('You are not in this conversation');

    if (participant.role !== Role.OWNER)
      throw new Error('You are not an owner of this conversation');

    return true;
  }
}
