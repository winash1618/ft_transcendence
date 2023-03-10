import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { GameService } from 'src/game/game.service';

let queue = [];

let users = [];

@WebSocketGateway(8001, {
	cors: {
		origin: process.env.FRONTEND_BASE_URL,
		credentials: true,
	},
})
export class PingpongGateway {
	constructor(private readonly jwtService: JwtService) {}

	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket) {
		const user = this.jwtService.verify(parse(client.handshake.headers.cookie).auth, {
			secret: process.env.JWT_SECRET,
		})
		users[user.id] = client;
		queue.push(user);
		if (queue.length > 1) {
			const player1 = queue.shift();
			const player2 = queue.shift();
			users[player1.id].join(player1.login);
			users[player2.id].join(player1.login);
			users[player1.id].emit('start', 1);
			users[player2.id].emit('start', 2);
		}
		console.log('connected');
	}

	handleDisconnect(client: any) {
		console.log('disconnected');
		this.handlePause(client, true);
	}

	@SubscribeMessage('ballX')
	async handleBallX(client: Socket, data: number): Promise<void> {
		// ballX = data;
		const user = this.jwtService.verify(parse(client.handshake.headers.cookie).auth, {
			secret: process.env.JWT_SECRET,
		})
		this.server.to(user.login).emit('ballX', data);
	}

	@SubscribeMessage('pause')
	handlePause(client: Socket, data: boolean): void {
		const user = this.jwtService.verify(parse(client.handshake.headers.cookie).auth, {
			secret: process.env.JWT_SECRET,
		})
		this.server.to(user.login).emit('pause', data);
	}

	@SubscribeMessage('ballY')
	handleBallY(client: Socket, data: number): void {
		const user = this.jwtService.verify(parse(client.handshake.headers.cookie).auth, {
			secret: process.env.JWT_SECRET,
		})
		this.server.to(user.login).emit('ballY', data);
	}

	@SubscribeMessage('player1Y')
	handlePlayer1Y(client: Socket, data: number): void {
		const user = this.jwtService.verify(parse(client.handshake.headers.cookie).auth, {
			secret: process.env.JWT_SECRET,
		})
		this.server.to(user.login).emit('player1Y', data);
	}

	@SubscribeMessage('player2Y')
	handlePlayer2Y(client: Socket, data: number): void {
		const user = this.jwtService.verify(parse(client.handshake.headers.cookie).auth, {
			secret: process.env.JWT_SECRET,
		})
		this.server.to(user.login).emit('player2Y', data);
	}

	@SubscribeMessage('player1Score')
	handlePlayer1Score(client: Socket, data: number): void {
		const user = this.jwtService.verify(parse(client.handshake.headers.cookie).auth, {
			secret: process.env.JWT_SECRET,
		})
		this.server.to(user.login).emit('player1Score', data);
	}

	@SubscribeMessage('player2Score')
	handlePlayer2Score(client: Socket, data: number): void {
		const user = this.jwtService.verify(parse(client.handshake.headers.cookie).auth, {
			secret: process.env.JWT_SECRET,
		})
		this.server.to(user.login).emit('player2Score', data);
	}
}
