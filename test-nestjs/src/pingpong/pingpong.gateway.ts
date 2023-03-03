import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { parse } from 'cookie';
import cookieParser from 'cookie-parser';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8001, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class PingpongGateway {
  @WebSocketServer()
  server: Server;
  handleConnection(client: Socket) {
    console.log(parse(client.request.headers.cookie).esc);
  }
  handleDisconnect(client: any) {
    this.handlePause(true);
  }
  @SubscribeMessage('ballX')
  handleBallX(client: Socket, @MessageBody() data: number): void {
    this.server.emit('ballX', data);
  }
  @SubscribeMessage('pause')
  handlePause(@MessageBody() data: boolean): void {
    this.server.emit('pause', data);
  }
  @SubscribeMessage('ballY')
  handleBallY(@MessageBody() data: number): void {
    this.server.emit('ballY', data);
  }
  @SubscribeMessage('player1Y')
  handlePlayer1Y(@MessageBody() data: number): void {
    this.server.emit('player1Y', data);
  }
  @SubscribeMessage('player2Y')
  handlePlayer2Y(@MessageBody() data: number): void {
    this.server.emit('player2Y', data);
  }
  @SubscribeMessage('player1Score')
  handlePlayer1Score(@MessageBody() data: number): void {
    this.server.emit('player1Score', data);
  }
  @SubscribeMessage('player2Score')
  handlePlayer2Score(@MessageBody() data: number): void {
    this.server.emit('player2Score', data);
  }
}
