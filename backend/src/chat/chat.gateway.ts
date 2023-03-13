import { OnModuleInit, UseGuards } from '@nestjs/common';
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
import { GatewaySessionManager } from './gateway.session';

@WebSocketGateway({
  // cors: {
  //   origin: [process.env.FRONTEND_BASE_URL],
  // },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly sessionManager: GatewaySessionManager) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log('Incoming Connection');
    // this.sessionManager.setUserSocket(socket.user.id, socket);
    socket.emit('connected', {});
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log('Disconnected');
    console.log('${socket.user.id} disconnected');
  }

  @SubscribeMessage('joinConversation')
  async onJoinConversation(socket: AuthenticatedSocket, @MessageBody() body: any) {

  }

  @UseGuards(WsJwtStrategy)
  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('onMessage', {
      msg: 'New Message',
      content: body,
    });
  }
}
