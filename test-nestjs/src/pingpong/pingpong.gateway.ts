import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(8001, { cors: '*' })
export class PingpongGateway {
  @WebSocketServer()
  server;
  handleConnection(client: Socket){
	console.log(client.request.headers.cookie);
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
