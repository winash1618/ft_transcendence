import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/database/prisma.service';
import { ConversationService } from 'src/chat/Queries/conversation.service';
import { ParticipantService } from 'src/chat/Queries/participant.service';
import { MessageService } from 'src/chat/Queries/message.service';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { GatewaySessionManager } from './gateway.session';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private prisma: PrismaService,
    private gatewaySession: GatewaySessionManager,
    private conversationService: ConversationService,
    private participantService: ParticipantService,
    private messageService: MessageService,
    private jwtService: JwtService,
    ) {}

  async handleConnection(client: Socket) {
		const token = client.handshake.auth.token;
		const userID = this.jwtService.verify(token, {
			secret: process.env.JWT_SECRET
		});

    client.data.userID = userID;

    this.gatewaySession.setUserSocket(userID, client);

    console.log('User connected: ', userID);

    const conversations = await this.conversationService.getConversationByUserId(userID);
    conversations.forEach(conversation => {
      client.join(conversation.id);
    });
    const sendConversation = await this.conversationService.getChatsByUserId(userID);
    client.emit('conversations', sendConversation);
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected: ', client.data.userID);
  }

  @SubscribeMessage('createConversation')
  async createConversation(client: Socket, @MessageBody() data: any) {
    const { title, password, privacy } = data;

    const conversation = await this.conversationService.createConversation({
      title,
      creator_id: client.data.userID,
      password,
      privacy,
    });

    await this.participantService.create({
      conversation_id: conversation.id,
      user_id: client.data.userID,
    });

    client.join(conversation.id);

    const connectedUsers = this.gatewaySession.getSockets().keys();
    if (!connectedUsers) return;
    const sendConversation = await this.conversationService.getChatsByUserId(client.data.userID);
    for (const user of connectedUsers) {
      this.server.to(user).emit('conversation_lists', sendConversation);
      this.server.to(user).emit('created_conversation', conversation);
    }

    client.emit('conversationCreated', conversation);
  }

  @SubscribeMessage('joinConversation')
  async joinConversation(client: Socket, @MessageBody() data: any) {
    const { conversationID } = data;

    const conversation = await this.conversationService.findOne(conversationID);
    if (!conversation) return;
    if (conversation.privacy === 'PRIVATE') {
      const participant = await this.participantService.getConversation(client.data.userID, conversationID);
      if (!participant) return;
    }
    const participant = this.participantService.getParticipantByUserIdAndConversationId(client.data.userID, conversationID);
    if (participant) {
      await this.participantService.updateRole(client.data.userID, conversationID, 'USER');
    }
    await this.participantService.create({
      conversation_id: conversationID,
      user_id: client.data.userID,
    });

    const connectedUsers = this.gatewaySession.getSockets().values();
    if (!connectedUsers) return;
    for (const user of connectedUsers) {
      user.join(conversationID);
      this.server.to(user.data.userID).emit('joined_conversation', conversationID);
    }
  }

  @SubscribeMessage('leaveConversation')
  async leaveConversation(client: Socket, @MessageBody() data: any) {
    const { conversationID } = data;

    const participant = await this.participantService.getConversation(client.data.userID, conversationID);

    if (participant) {
      await this.participantService.remove(participant.id);

      client.leave(conversationID);

      client.to(conversationID).emit('userLeft', { userID: client.data.userID });
    }
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, @MessageBody() data: any) {
    const { conversationID, message } = data;

    const messageSent = await this.messageService.create({
      conversation_id: conversationID,
      author_id: client.data.userID,
      message,
    });

    client.to(conversationID).emit('messageReceived', messageSent);
  }

  @SubscribeMessage('deleteMessage')
  async deleteMessage(client: Socket, @MessageBody() data: any) {
    const { messageID } = data;

    const message = await this.messageService.findOne(messageID);

    if (message && message.author_id === client.data.userID) {
      await this.messageService.remove(messageID);

      client.to(message.conversation_id).emit('messageDeleted', messageID);
    }
  }

  @SubscribeMessage('blockUser')
  async blockUser(client: Socket, @MessageBody() data: any) {
    const { userID } = data;

    const participant = await this.participantService.getConversation(client.data.userID, userID);

    if (!participant) {
      await this.participantService.create({
        conversation_id: client.data.userID,
        user_id: userID,
      });

      client.emit('userBlocked', { userID });
    }
  }

  @SubscribeMessage('unblockUser')
  async unblockUser(client: Socket, @MessageBody() data: any) {
    const { userID } = data;

    const participant = await this.participantService.getConversation(client.data.userID, userID);

    if (participant) {
      await this.participantService.remove(participant.id);

      client.emit('userUnblocked', { userID });
    }
  }

  @SubscribeMessage('updateConversation')
  async updateConversation(client: Socket, @MessageBody() data: any) {
    const { conversationID, title, privacy } = data;

    const conversation = await this.conversationService.findOne(conversationID);

    if (conversation && conversation.creator_id === client.data.userID) {
      const updatedConversation = await this.conversationService.update(conversationID, {
        title,
        privacy,
      });

      client.to(conversationID).emit('conversationUpdated', updatedConversation);
    }
  }

  @SubscribeMessage('setConversationPassword')
  async setConversationPassword(client: Socket, @MessageBody() data: any) {
    const { conversationID, password } = data;

    const conversation = await this.conversationService.findOne(conversationID);

    if (conversation && conversation.creator_id === client.data.userID) {
      const updatedConversation = await this.conversationService.update(conversationID, {
        password,
      });

      client.to(conversationID).emit('conversationUpdated', updatedConversation);
    }
  }

  @SubscribeMessage('removeConversationPassword')
  async removeConversationPassword(client: Socket, @MessageBody() data: any) {
    const { conversationID } = data;

    const conversation = await this.conversationService.findOne(conversationID);

    if (conversation && conversation.creator_id === client.data.userID) {
      const updatedConversation = await this.conversationService.update(conversationID, {
        password: null,
      });

      client.to(conversationID).emit('conversationUpdated', updatedConversation);
    }
  }

  @SubscribeMessage('setConversationPrivacy')
  async setConversationPrivacy(client: Socket, @MessageBody() data: any) {
    const { conversationID, privacy } = data;

    const conversation = await this.conversationService.findOne(conversationID);

    if (conversation && conversation.creator_id === client.data.userID) {
      const updatedConversation = await this.conversationService.update(conversationID, {
        privacy,
      });

      client.to(conversationID).emit('conversationUpdated', updatedConversation);
    }
  }

  @SubscribeMessage('setConversationAdmin')
  async setConversationAdmin(client: Socket, @MessageBody() data: any) {
    const { conversationID, userID } = data;

    const conversation = await this.conversationService.findOne(conversationID);

    if (conversation && conversation.creator_id === client.data.userID) {
      const participant = await this.participantService.getConversation(userID, conversationID);

      if (participant) {
        await this.participantService.update(participant.id, {
          role: Role.ADMIN
        });

        client.to(conversationID).emit('userAdminSet', { userID });
      }
    }
  }

  @SubscribeMessage('kickUser')
  async kickUser(client: Socket, @MessageBody() data: any) {
    const { conversationID, userID } = data;

    const conversation = await this.conversationService.findOne(conversationID);

    if (conversation && conversation.creator_id === client.data.userID) {
      const participant = await this.participantService.getConversation(userID, conversationID);

      if (participant) {
        await this.participantService.remove(participant.id);

        client.to(conversationID).emit('userKicked', { userID });
      }
    }
  }
}
