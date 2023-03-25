import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { RouterModule } from '@nestjs/core';


let number = 0;

@WebSocketGateway(8001, {
	cors: {
		origin: process.env.FRONTEND_BASE_URL,
		credentials: true,
	},
})
export class MessagesGateway{
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
			console.log(user.login);
			// client.join("mkaruvan");
			// client.rooms.add("mkaruvan");
			client.join("mkaruvan");
			number += 1;
			console.log(client.rooms);
			console.log("Message gateway: ", number);
		}
		catch (e) {
			client.emit('error', 'Unauthorized access');
		}
	}
	@SubscribeMessage('message')
	async handleMessage(client: any, payload: any): Promise<void> {
		// payload.type = "right";
		// this.server.emit('message', payload);
		const token = client.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			console.log("Rooms: ", client.rooms);
			// const roomsArray = [...client.rooms];
			// console.log(roomsArray[0]);
			// this.server.in(user.login).emit('message', payload);
			// console.log(client);
			// this.server.emit('message', payload);
			// client.emit('message', payload);
			// console.log(payload);
			// client.to("mkaruvan").emit("message", payload);
			this.server.to("mkaruvan").emit("message", payload);

			console.log("Sending Success");
		}
		catch (e) {
			client.emit('error', 'Unauthorized access');
		}
	}

	// @SubscribeMessage('join')
	// async handleJoin(client: any, payload: any): Promise<void> {
	// 	// payload.type = "right";
	// 	// this.server.emit('message', payload);
	// 	const token = client.handshake.auth.token;
	// 	let user = null;
	// 	try {
	// 		user = this.jwtService.verify(token, {
	// 			secret: process.env.JWT_SECRET,
	// 		});
	// 		// add user to the Room
	// 		client.join(payload.room);
	// 	}
	// 	catch (e) {
	// 		client.emit('error', 'Unauthorized access');
	// 	}
	// }
	
}


// export class MessagesGateway{
	
// 	@WebSocketServer()
// 	server: Server;
// 	handleConnection(client: any) {
// 		const side = randomInt(0, 2) == 0 ? "left" : "right";
// 		console.log(side);
// 		client.join(side);
// 	}
// 	@SubscribeMessage('message')
// 	async handleMessage(client: any, payload: any): Promise<void> {
// 		// payload.type = "right";
// 		client.to("left").emit("message", payload);
// 	}
	
// }
