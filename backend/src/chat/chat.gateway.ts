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
import { Server } from 'socket.io';
import { AuthenticatedSocket } from 'src/utils/AuthenticatedScoket.interface';
import { PrismaService } from 'src/database/prisma.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { ParticipantService } from 'src/participant/participant.service';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private prisma: PrismaService,
    private conversationService: ConversationService,
    private participantService: ParticipantService,
    private messageService: MessageService,
    ) {}

  async handleConnection(socket: AuthenticatedSocket) {
    const userID = socket.handshake.query.userID as string;
    const conversationID = socket.handshake.query.conversationID as string;

    const participant = await this.participantService.getConversation(userID, conversationID);

    if (!participant) {
      socket.disconnect();
      return;
    }

    socket.join(conversationID);

    socket.to(conversationID).emit('userJoined', { userID });

    const messages = await this.prisma.message.findMany({
      where: { conversation_id: conversationID },
      include: { author: true },
      orderBy: { created_at: 'asc' },
    });

    socket.emit('conversationHistory', messages);
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    const userID = socket.handshake.query.userID as string;
    const conversationID = socket.handshake.query.conversationID as string;

    socket.to(conversationID).emit('userLeft', { userID });
  }

  @SubscribeMessage('createConversation')
  async createConversation(socket: AuthenticatedSocket, @MessageBody() data: any) {
    const { title, privacy, channel_id } = data;

    const conversation = await this.conversationService.create({
      title,
      privacy,
      channel_id,
      creator_id: socket.user.userID,
    });

    await this.participantService.create({
      conversation_id: conversation.id,
      user_id: socket.user.userID,
    });

    socket.emit('conversationCreated', conversation);
  }

}
