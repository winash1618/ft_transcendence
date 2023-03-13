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
import { WsJwtStrategy } from 'src/auth/Strategy/ws-jwt.strategy';
import { PrismaService } from 'src/database/prisma.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private prisma: PrismaService) {}

  async handleConnection(socket: AuthenticatedSocket) {
    const userID = socket.handshake.query.userID as string;
    const conversationID = socket.handshake.query.conversationID as string;

    const participant = await this.prisma.participant.findUnique({
      where: {
        conversation_id_user_id: {
          conversation_id: conversationID,
          user_id: userID,
        },
      },
    });

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

  @SubscribeMessage('sendMessage')
  async handleMessage(socket: AuthenticatedSocket, data: any) {
    const userID = socket.handshake.query.userID as string;
    const conversationID = socket.handshake.query.conversationID as string;

    const message = await this.prisma.message.create({
      data: {
        message: data.message,
        conversation: { connect: { id: conversationID } },
        author: { connect: { id: userID } },
      },
      include: { author: true },
    });

    socket.to(conversationID).emit('newMessage', message);
  }
}
