import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

let queue = {
	'1': [],
	'2': [],
	'3': [],
	'4': []
};

let users = [];

@WebSocketGateway(8001, {
	cors: {
		origin: process.env.FRONTEND_BASE_URL,
		credentials: true,
	},
})
export class PingpongGateway {
	constructor(private readonly jwtService: JwtService) { }

	@WebSocketServer()
	server: Server;

	handleConnection(client: any) {
		const token = client.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			users[user.id] = { client };
			console.log('connected');
		}
		catch (e) {
			client.emit('error', 'Unauthorized access');
		}
	}

	handleDisconnect(client: any) {
		const token = client.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
				ignoreExpiration: true
			});
			if (users[user.id].map) {
				queue[users[user.id].map] = queue[users[user.id].map].filter((item: any) => item.login !== user.login);
			}
		}
		catch (e) {
			client.emit('error', 'Unauthorized access');
		}
	}

	@SubscribeMessage('ballX')
	async handleBallX(client: Socket, data: number): Promise<void> {
		const token = client.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			this.server.in(user.login).emit('ballX', data);
		}
		catch (e) {
			client.emit('error', 'Unauthorized access');
		}
	}
	@SubscribeMessage('queue')
	async enterQueue(client: Socket, data: any): Promise<void> {
		const token = client.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const checkIfExists = queue[data.map].find((item: any) => item.login === user.login);
			if (checkIfExists) {
				client.emit('error', 'Already in queue');
				return;
			}
			queue[data.map].push(user);
			users[user.id] = {
				...users[user.id],
				map: data.map
			}
			if (queue[data.map].length > 1) {
				const player1 = queue[data.map].shift();
				const player2 = queue[data.map].shift();
				users[player1.id].client.join(player1.login, () => console.log(users[player1.id].client.rooms));
				users[player2.id].client.join(player1.login);
				users[player1.id] = {
					...users[player1.id],
					room: player1.login
				}
				users[player2.id] = {
					...users[player2.id],
					room: player2.login
				}
				users[player1.id].client.emit('start', 1);
				users[player2.id].client.emit('start', 2);
			}
		}
		catch (e) {
			console.log(e);
			client.emit('error', 'Unauthorized access');
		}
	}

	@SubscribeMessage('pause')
	handlePause(client: Socket, data: boolean): void {
		// const token = client.handshake.auth.token;
		// let user = null;
		// try {
		// 	user = this.jwtService.verify(token, {
		// 		secret: process.env.JWT_SECRET,
		// 	});
		// }
		// catch (e) {
		// 	throw new WsException('Unauthorized access');
		// }
		// this.server.to(user.login).emit('pause', data);
	}

	@SubscribeMessage('ballY')
	handleBallY(client: Socket, data: number): void {
		const token = client.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			this.server.in(user.login).emit('ballY', data);
		}
		catch (e) {
			client.emit('error', 'Unauthorized access');
		}
	}

	@SubscribeMessage('player1Y')
	handlePlayer1Y(client: Socket, data: number): void {
		const token = client.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			this.server.in(user.login).emit('player1Y', data);
		}
		catch (e) {
			client.emit('error', 'Unauthorized access');
		}
	}

	@SubscribeMessage('player2Y')
	handlePlayer2Y(client: Socket, data: number): void {
		const token = client.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			this.server.in(users[user.id].room).emit('player2Y', data);
		}
		catch (e) {
			client.emit('error', 'Unauthorized access');
		}
	}

	@SubscribeMessage('player1Score')
	handlePlayer1Score(client: Socket, data: number): void {
		const token = client.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			this.server.in(user.login).emit('player1Score', data);
		}
		catch (e) {
			client.emit('error', 'Unauthorized access');
		}
	}

	@SubscribeMessage('player2Score')
	handlePlayer2Score(client: Socket, data: number): void {
		const token = client.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			this.server.in(user.login).emit('player2Score', data);
		}
		catch (e) {
			client.emit('error', 'Unauthorized access');
		}
	}
}
