import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';



@WebSocketGateway(8001, {
	cors: {
		origin: process.env.FRONTEND_BASE_URL,
		credentials: true,
	},
})
export class MessagesGateway{
	
	@WebSocketServer()
	server: Server;
	handleConnection(client: any) {
		console.log(client);
	}
	@SubscribeMessage('message')
	async handleMessage(client: any, payload: any): Promise<void> {
		// payload.type = "right";
		this.server.emit('message', payload);
	}
	
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
