import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
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
    const token = client.handshake.headers.token as string;
    const userID = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET
    });

    client.data.userID = userID;

    this.gatewaySession.setUserSocket(userID.id, client);

    console.log('User connected: ', userID);

    const conversations = await this.conversationService.getConversationByUserID(userID.id);

    for (const conversation of conversations) {
      client.join(conversation.id);
    }

    const messages = await Promise.all(conversations.map(async (conversation) => {
      const messages = await this.messageService.getMessagesByConversationID(conversation.id);
      return {
        conversationID: conversation.id,
        messages,
      }
    }));

    console.log(messages);

    client.emit('User_conversations', messages);

  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected: ', client.data.userID);
  }

  @SubscribeMessage('createConversation')
  async createConversation(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const conversation = await this.conversationService.createConversation({
      title: data.title,
    });

    // add only one participant
    const participant = await this.participantService.addParticipantToConversation({
      conversation_id: conversation.id,
      user_id: client.data.userID.id,
      role: Role.ADMIN,
      conversation_status: 'ACTIVE',
    });

    const messages = await this.messageService.getMessagesByConversationID(conversation.id);

    this.server.to(conversation.id).emit('conversation_created', {
      conversation,
      participant,
      messages,
    });
  }

  @SubscribeMessage('joinConversation')
  async joinConversation(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const participant = await this.participantService.addParticipantToConversation({
      conversation_id: data.conversationID,
      user_id: client.data.userID.id,
      role: Role.USER,
      conversation_status: 'ACTIVE',
    });

    const messages = await this.messageService.getMessagesByConversationID(data.conversationID);

    this.server.to(data.conversationID).emit('conversation_joined', {
      participant,
      messages,
    });
  }

  // @SubscribeMessage('directMessage')
  // async directMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
  // }

  // @SubscribeMessage('leaveConversation')
  // async leaveConversation(@ConnectedSocket() client: Socket, @MessageBody() data: any) {


  @SubscribeMessage('sendMessage')
  async sendMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log(data, data.conversationID);
    const message = await this.messageService.createMessage({
      message: data.message,
      author_id: client.data.userID.id,
      conversation_id: data.conversationID,
    });

    console.log(message);

    this.server.to(data.conversationID).emit('message_created', message);
  }

  // helper function

  private async joinConversations(client: Socket) {
    const conversations = await this.conversationService.getConversationByUserID(client.data.userID.id);

    for (const conversation of conversations) {
      client.join(conversation.id);
    }
  }

  private async joinConversationByID(client: Socket, conversationID: string) {
    const sockets = this.gatewaySession.getAllUserSockets();
    if (!sockets || sockets.length === 0) return ;
    sockets.forEach((socket) => {
      socket.join(conversationID);
    });
  }

  private async leaveConversationByID(client: Socket, conversationID: string) {
    const sockets = this.gatewaySession.getAllUserSockets();
    if (!sockets || sockets.length === 0) return ;
    sockets.forEach((socket) => {
      socket.leave(conversationID);
    });
  }

  private async sendMessagesToClient(client: Socket) {
    const conversations = await this.conversationService.getConversationByUserID(client.data.userID.id);

    const messages = await Promise.all(conversations.map(async (conversation) => {
      const messages = await this.messageService.getMessagesByConversationID(conversation.id);
      return {
        conversationID: conversation.id,
        messages,
      }
    }));

    client.emit('User_conversations', messages);
  }

  private async sendMessagesToUser(userID: string) {
    const client = this.gatewaySession.getAllUserSockets();
    if (!client || client.length === 0) return ;
    const conversations = await this.conversationService.getConversationByUserID(userID);

    const messages = await Promise.all(conversations.map(async (conversation) => {
      const messages = await this.messageService.getMessagesByConversationID(conversation.id);
      return {
        conversationID: conversation.id,
        messages,
      }
    }));

    client.forEach((socket) => {
      this.server.to(socket.id).emit('User_conversations', messages);
    });
  }

  private async sendMessagesToParticipants(conversationID: string, message: any) {
    const participants = await this.participantService.getParticipantsByConversationID(conversationID);

    participants.forEach((participant) => {
      const client = this.gatewaySession.getUserSocket(participant.user_id);
      if (!client) return ;
      this.server.to(client.id).emit('message_created', message);
    });
  }

  private async sendConversationCreatedToAllClients(userID: string, conversation: any) {
    const sockets = this.gatewaySession.getAllUserSockets();
    if (!sockets || sockets.length === 0) return ;
    sockets.forEach((socket) => {
      this.server.to(socket.id).emit('conversation_created', conversation);
    });
    this.server.emit('conversation_created', conversation);
  }

  private async sendConversationProtectedToAllClients(userID: string, conversation: any) {
    const sockets = this.gatewaySession.getAllUserSockets();
    if (!sockets || sockets.length === 0) return ;
    sockets.forEach((socket) => {
      this.server.to(socket.id).emit('conversation_protected', conversation);
    });
    this.server.emit('conversation_protected', conversation);
  }

  private async sendConversationJoinedToAllClients(userID: string, conversationID: string) {
    const conversations = await this.conversationService.getConversationByID(conversationID);

    const participants = conversations.participants;
    participants.forEach(async (participant) => {
      const messages = await this.messageService.getMessagesByConversationID(conversationID);
      const sockets = this.gatewaySession.getAllUserSockets();
      if (!sockets || sockets.length === 0) return ;
      sockets.forEach((socket) => {
        this.server.to(socket.id).emit('conversation_joined', {
          conversationID,
          participant,
          messages,
        });
      });
    });
  }

  private async sendConversationLeftToAllClients(userID: string, conversationID: string) {
    const sockets = this.gatewaySession.getAllUserSockets();
    if (!sockets || sockets.length === 0) return ;
    sockets.forEach((socket) => {
      this.server.to(socket.id).emit('conversation_left', {
        conversationID,
        userID,
      });
    });
  }
}
