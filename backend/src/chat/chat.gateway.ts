import { UsePipes, InternalServerErrorException } from '@nestjs/common';
import { ValidationPipe, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationService } from './Queries/conversation.service';
import { ParticipantService } from './Queries/participant.service';
import { MessageService } from './Queries/message.service';
import { Participant, Privacy, Role, Status } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { GatewaySessionManager } from './gateway.session';
import { WsJwtStrategy } from 'src/auth/Strategy/ws-jwt.strategy';
import {
  sendMessageDto,
  createConversationDto,
  joinConversationDto,
  DirectMessageDTO,
  LeaveConversationDTO,
  AddPasswordDTO,
  MakeAdminDTO,
  AddParticipantDTO,
  RemoveParticipantDTO,
  BanUserDTO,
  UnBanUserDTO,
  KickUserDTO,
  MuteUserDTO,
} from './dto/GatewayDTO/index.dto';
import { ConfigService } from '@nestjs/config';
import { WebSocketConfig } from 'src/utils/ws-config';
import { UsersService } from 'src/users/users.service';
import { validationService } from './Queries/validation.service';
import { RemovePasswordDTO } from './dto/GatewayDTO/removePassword.dto';

// @WebSocketGateway(8001, WebSocketConfig.getOptions(new ConfigService()))
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private gatewaySession: GatewaySessionManager,
    private conversationService: ConversationService,
    private participantService: ParticipantService,
    private messageService: MessageService,
    private jwtService: JwtService,
    private validation: validationService,
    private userService: UsersService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // const token = client.handshake.auth.token as string;
      const token = client.handshake.headers.token as string;
      const userID = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      client.data.userID = userID;
      const user = this.gatewaySession.getUserSocket(userID.id);
      if (user) {
        this.gatewaySession.removeUserSocket(userID.id);
        this.handleDisconnect(user);
      }

      this.gatewaySession.setUserSocket(userID.id, client);

      console.log('User connected chat: ', userID);

      const conversations =
        await this.conversationService.getConversationByUserID(userID.id);

      for (const conversation of conversations) {
        client.join(conversation.id);
      }
    }
    catch (e) {
      console.error('Error Connecting to Game Gateway: ', e.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    try {
      console.log('User disconnected: ', client.data.userID);
      this.gatewaySession.removeUserSocket(client.data.userID.id);
    }
    catch (e) {
      console.error('User disconnected:', e.message);
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('createConversation')
  async createConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: createConversationDto,
  ) {
    console.log('In createConversation');
    try {
      //this.verifyToken(client);
      await this.validation.validateCreateConversation(data, client.data.userID.id)

      const conversation = await this.conversationService.createConversation({
        title: data.title,
        creator_id: client.data.userID.id,
        password: data.password,
        privacy: data.privacy,
      });

      // add only one participant
      const participant =
        await this.participantService.addParticipantToConversation({
          conversation_id: conversation.id,
          user_id: client.data.userID.id,
          role: Role['OWNER'],
          conversation_status: 'ACTIVE',
        });

      if (!participant)
        throw new Error('Failed to add participant to conversation');

      await this.joinConversations(client.data.userID.id, conversation.id);
      await this.sendConversationCreatedToAllClients(
        client.data.userID.id,
        conversation,
      );
    } catch (e) {
      console.log(e);
      throw new WsException({
        message: 'Create conversation failed',
        error: e.message,
      });
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('joinConversation')
  async joinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: joinConversationDto,
  ) {
    console.log('In joinConversation');

    try {
      //this.verifyToken(client);
      await this.validation.validateJoinConversation(data.conversationID, client.data.userID.id, data.password);
      const participant =
        await this.participantService.addParticipantToConversation(
          {
            conversation_id: data.conversationID,
            user_id: client.data.userID.id,
            role: Role.USER,
            conversation_status: 'ACTIVE',
          },
          data.password,
        );

      if (!participant)
        throw new Error('Failed to add participant to conversation');

      await this.joinConversations(client.data.userID.id, data.conversationID);
      this.server.to(data.conversationID).emit('conversationJoined', {
        conversationID: data.conversationID,
        userID: client.data.userID.id,
      });
    } catch (e) {
      console.log(e);
      throw new WsException({
        message: 'Join conversation failed',
        error: e.message,
      });
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('directMessage')
  async directMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: DirectMessageDTO,
  ) {
    console.log('In directMessage');
    try {
      //this.verifyToken(client);
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
    } catch (e) {
      throw new WsException({
        message: 'Direct conversation failed',
        error: e.message,
      });
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('leaveConversation')
  async leaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: LeaveConversationDTO,
  ) {
    try {
      //this.verifyToken(client);
      await this.validation.validateLeaveConversation(data.conversationID, client.data.userID.id);

      const removedParticipant =
        await this.participantService.removeParticipantFromConversation(
          data.conversationID,
          client.data.userID.id,
        );

      if (!removedParticipant)
        throw new Error('Failed to remove participant from conversation');

      await this.conversationService.promoteOldestUserToAdmin(
        data.conversationID,
      );

      const user = this.gatewaySession.getUserSocket(client.data.userID.id);
      if (!user) return;
      this.server.to(data.conversationID).emit('conversationLeft', {
        conversationID: data.conversationID,
        userID: client.data.userID.id,
      });
      user.leave(data.conversationID);
    } catch (e) {
      console.log(e);
      throw new WsException({
        message: 'Leave conversation failed',
        error: e.message,
      });
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('addPassword')
  async protectRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: AddPasswordDTO,
  ) {
    try {
      //this.verifyToken(client);
      await this.validation.validateAddPassword(data.conversationID, client.data.userID.id);

      const conversation = await this.conversationService.protectConversation(
        data.conversationID,
        data.password,
        client.data.userID.id,
      );

      if (!conversation)
        throw new Error('Failed to add password to conversation');

      this.server.to(data.conversationID).emit('conversationProtected', {
        conversationID: data.conversationID,
        userID: client.data.userID.id,
      });
    } catch (e) {
      throw new WsException({
        message: 'Add Password failed',
        error: e.message,
      });
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: sendMessageDto,
  ) {
    console.log('In sendMessage', data);
    try {
      //this.verifyToken(client);
      const participant =
        await this.participantService.findParticipantByUserIDandConversationID(
          client.data.userID.id,
          data.conversationID,
        );

      if (!participant) throw new Error('Participant not found');

      if (participant.mute_expires_at) {
        const currentTime = new Date();
        if (currentTime > participant.mute_expires_at)
          await this.conversationService.unmuteUser(
            data.conversationID,
            client.data.userID.id,
          );
        else throw new Error('You are muted');
      }

      const message = await this.messageService.createMessage(
        {
          message: data.message,
          author_id: participant.id,
          conversation_id: data.conversationID,
        },
        client.data.userID.id,
      );

      this.server.to(data.conversationID).emit('messageCreated', message);
    } catch (e) {
      console.log(e);
      throw new WsException({
        message: 'Send Message failed',
        error: e.message,
      });
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('makeAdmin')
  async makeAdmin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MakeAdminDTO,
  ) {
    try {
      //this.verifyToken(client);
      await this.validation.validateMakeAdmin(data.conversationID, client.data.userID.id, data.userID);
      const participant = await this.participantService.makeParticipantAdmin(
        data.conversationID,
        data.userID,
        client.data.userID.id,
      );

      this.server.to(data.conversationID).emit('adminMade', {
        conversationID: data.conversationID,
        admin: participant.user_id,
      });
    } catch (e) {
      throw new WsException({
        message: 'Make Admin failed',
        error: e.message,
      });
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('addParticipant')
  async addParticipant(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: AddParticipantDTO,
  ) {
    console.log('In addParticipant');

    try {
      //this.verifyToken(client);
      await this.validation.validateAddParticipant(data.conversationID, client.data.userID.id, data.userID);

      const participant =
        await this.participantService.addParticipantToConversation({
          conversation_id: data.conversationID,
          user_id: data.userID,
          role: Role.USER,
          conversation_status: 'ACTIVE',
        });

      this.joinConversations(data.userID, data.conversationID);
      this.server.to(data.conversationID).emit('participantAdded', {
        conversationID: data.conversationID,
        participant: participant.user_id,
      });
    } catch (e) {
      console.log(e);
      throw new WsException({
        message: 'Add Participant failed',
        error: e.message,
      });
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('removeParticipant')
  async removeParticipant(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: RemoveParticipantDTO,
  ) {
    console.log('In removeParticipant');

    try {
      //this.verifyToken(client);
      await this.validation.validateRemoveParticipant(data.conversationID, client.data.userID.id, data.userID);

      const participant =
        await this.participantService.removeParticipantFromConversation(
          data.conversationID,
          data.userID,
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
    } catch (e) {
      throw new WsException({
        message: 'Remove Participant failed',
        error: e.message,
      });
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('banUser')
  async banUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: BanUserDTO,
  ) {
    try {
      //this.verifyToken(client);
      console.log('In banUser');

      await this.validation.validateBanUser(data.conversationID, client.data.userID.id, data.userID);

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
        error: e.message,
      });
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('unbanUser')
  async unbanUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UnBanUserDTO,
  ) {
    try {
      //this.verifyToken(client);
      console.log('In unbanUser');

      await this.validation.validateUnBanUser(data.conversationID, client.data.userID.id, data.userID);

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
        error: e.message,
      });
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('removePassword')
  async removePassword(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: RemovePasswordDTO,
  ) {
    try {
      //this.verifyToken(client);
      console.log('In removePassword');

      await this.validation.validateRemovePassword(data.conversationID, client.data.userID.id);

      const conversation =
        await this.conversationService.removePasswordFromConversation(
          data.conversationID,
        );

      if (!conversation) throw new Error('Conversation does not have password');

      this.server.to(data.conversationID).emit('passwordRemoved', {
        conversationID: data.conversationID,
        userID: client.data.userID.id,
      });
    } catch (e) {
      throw new WsException({
        message: 'Remove Password failed',
        error: e.message,
      });
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('muteUser')
  async muteUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MuteUserDTO,
  ) {
    try {
      //this.verifyToken(client);
      await this.validation.validateMute(data.conversationID, client.data.userID.id, data.userID);
      const conversation = await this.conversationService.muteUser(
        data.conversationID,
        data.userID,
        client.data.userID.id,
      );

      if (!conversation) throw new Error('User was not muted');

      this.server.to(data.conversationID).emit('userMuted', {
        conversationID: data.conversationID,
        mutedUserID: data.userID,
      });
    } catch (e) {
      throw new WsException({
        message: 'Mute User failed',
        error: e.message,
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

  verifyToken(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const userid = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      return userid;
    } catch (e) {
      console.error('Error connecting to game gateway:', e.message);
      throw new WsException('Token expired');
    }
  }
}
