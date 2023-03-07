import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';


let ArrayOfPlayers = [{
	id: 1,
	ballY: 0,
	ballX: 0,
	playerY: 0,
}];

@WebSocketGateway(8001, {
	cors: {
		origin: process.env.FRONTEND_BASE_URL,
		credentials: true,
	},
})
export class PingpongGateway {
	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket) {
		console.log('connected');
	}
	handleDisconnect(client: any) {
		console.log('disconnected');
		this.handlePause(true);
	}
	@SubscribeMessage('ballX')
	handleBallX(@MessageBody() data: number): void {
		// ballX = data;
		this.server.emit('ballX', data);
	}
	@SubscribeMessage('pause')
	handlePause(@MessageBody() data: boolean): void {
		this.server.emit('pause', data);
	}
	@SubscribeMessage('ballY')
	handleBallY(@MessageBody() data: number): void {
		// ballY = data;
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
	handlePlayer1Score(client: Socket, @MessageBody() data: number): void {
		this.server.emit('player1Score', data);
	}
	@SubscribeMessage('player2Score')
	handlePlayer2Score(@MessageBody() data: number): void {
		this.server.emit('player2Score', data);
	}
}
