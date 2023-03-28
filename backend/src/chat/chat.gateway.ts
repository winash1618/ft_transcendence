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
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedSocket } from 'src/utils/AuthenticatedScoket.interface';
import { PrismaService } from 'src/database/prisma.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { ParticipantService } from 'src/participant/participant.service';
import { MessageService } from 'src/message/message.service';
import { Role } from '@prisma/client';
@WebSocketGateway(8001, {
	cors: {
		origin: process.env.FRONTEND_BASE_URL,
		credentials: true,
	},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	userService: any;

	constructor(
		private prisma: PrismaService,
		private conversationService: ConversationService,
		private participantService: ParticipantService,
		private messageService: MessageService,
		private readonly jwtService: JwtService,
	) { }

	async handleConnection(socket: AuthenticatedSocket) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			console.log("User: ", user);
			const ListOfAllUsers = await this.prisma.user.findMany();
			const ListOfAllUsersWithoutMe = ListOfAllUsers.filter((u) => u.id !== user.id);
			const ListOfAllUsersObject = [];
			ListOfAllUsersWithoutMe.forEach((u) => {
				ListOfAllUsersObject.push({
					login: u.login
				});
			});
			console.log("List of all users object: ", ListOfAllUsersObject);

			// get the participnt object of the user
			const participants = await this.prisma.participant.findMany({
				where: {
					user_id: user.id,
				},
				include: {
					conversation: true,
				},
			});
			console.log("Participants: ", participants);
			const conversations = participants[0].conversation.map(conversation => ({
				  ...conversation,
				}));

			console.log("Conversations: ", conversations);
			conversations.forEach((c) => {
				socket.join(c.id);
			});
			console.log("Rooms: ", socket.rooms);
			const conversationObjects = [];
			for (const c of conversations) {
			 
			  conversationObjects.push( await this.prisma.conversation.findMany({
				where: {
				  id: c.id,
				},
				include: {
				  participants: true,
				  messages: true,
				},
			  }));
			}
			const flattenedConversationObjects = conversationObjects.concat.apply([], conversationObjects);
			const twoPeopleConversationObject = flattenedConversationObjects.filter(conversation => conversation.participants.length === 2);
			console.log("Conversation Object: ", twoPeopleConversationObject);

			const objectToEmit = {
				conversations: twoPeopleConversationObject,
				ListOfAllUsers: ListOfAllUsersObject,
				participant_id: participants[0].id,
			}

			socket.emit('availableUsers', objectToEmit);
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access');
		}

		// const userID = socket.handshake.query.userID as string;
		// const conversationID = socket.handshake.query.conversationID as string;

		// console.log('User connected: ', userID, conversationID);

		// const participant = await this.participantService.getConversation(userID, conversationID);

		// console.log('Participant: ', participant);

		// if (!participant) {
		//   socket.disconnect();
		//   return;
		// }

		// socket.join(conversationID);

		// socket.to(conversationID).emit('userJoined', { userID });

		// const messages = await this.prisma.message.findMany({
		//   where: { conversation_id: conversationID },
		//   include: { author: true },
		//   orderBy: { created_at: 'asc' },
		// });

		// socket.emit('conversationHistory', messages);
	}

	@SubscribeMessage('sendMessage')
	async sendMessage(socket: AuthenticatedSocket, data: any) {
		// console.log("Sending Message", socket);
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const participant = await this.participantService.getParticipantsByUserID(user.id);
			console.log("Participant: ", participant);
			await this.messageService.create({
				conversation_id: data.conversation_id,
				author_id: data.author_id,
				message: data.content,
			});
			console.log("Message Sent");
			this.server.emit("sendMessage", data);

		// socket.to(conversationID).emit('messageReceived', messageSent);
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access');
		}
		// const { conversationID, message } = data;

		// const messageSent = await this.messageService.create({
		//   conversation_id: conversationID,
		//   author_id: socket.user.id,
		//   message,
		// });

		// socket.to(conversationID).emit('messageReceived', messageSent);
	}

	handleDisconnect(socket: AuthenticatedSocket) {
		// const userID = socket.handshake.query.userID as string;
		// const conversationID = socket.handshake.query.conversationID as string;

		// console.log('User disconnected: ', userID, conversationID);

		// socket.to(conversationID).emit('userLeft', { userID });
	}

	@SubscribeMessage('reloadConversations')
	async reloadConversations(socket: AuthenticatedSocket, data: any) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const conversationObjects = [];
			for (const c of data) {
			 
			  conversationObjects.push( await this.prisma.conversation.findMany({
				where: {
				  id: c.id,
				},
				include: {
				  participants: true,
				  messages: true,
				},
			  }));
			}
			const flattenedConversationObjects = conversationObjects.concat.apply([], conversationObjects);
			console.log("Flattened Conversation Objects: ", flattenedConversationObjects);
			socket.emit('reloadConversations', flattenedConversationObjects);
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access');
		}
	}

	@SubscribeMessage('getTwoPeopleConversation')
	async getTwoPeopleConversation(socket: AuthenticatedSocket, data: any) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const participants = await this.prisma.participant.findMany({
				where: {
					user_id: user.id,
				},
				include: {
					conversation: true,
				},
			});
			const conversations = participants[0].conversation.map(conversation => ({
				...conversation,
			  }));
			  const conversationObjects = [];
			  for (const c of conversations) {
			   
				conversationObjects.push( await this.prisma.conversation.findMany({
				  where: {
					id: c.id,
				  },
				  include: {
					participants: true,
					messages: true,
				  },
				}));
			  }
			  const flattenedConversationObjects = conversationObjects.concat.apply([], conversationObjects);
			  const twoPeopleConversationObject = flattenedConversationObjects.filter(conversation => conversation.participants.length === 2);
			  console.log("Two People Conversation Object: ", twoPeopleConversationObject);
			  socket.emit('getTwoPeopleConversation', twoPeopleConversationObject);
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access');
		}
	}
	@SubscribeMessage('getManyPeopleConversation')
	async getManyPeopleConversation(socket: AuthenticatedSocket, data: any) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const participants = await this.prisma.participant.findMany({
				where: {
					user_id: user.id,
				},
				include: {
					conversation: true,
				},
			});
			const conversations = participants[0].conversation.map(conversation => ({
				...conversation,
			  }));
			  const conversationObjects = [];
			for (const c of conversations) {
			 
			  conversationObjects.push( await this.prisma.conversation.findMany({
				where: {
				  id: c.id,
				},
				include: {
				  participants: true,
				  messages: true,
				},
			  }));
			}
			const flattenedConversationObjects = conversationObjects.concat.apply([], conversationObjects);
			const manyPeopleConversationObject = flattenedConversationObjects.filter(conversation => conversation.participants.length > 2);
			socket.emit('getManyPeopleConversation', manyPeopleConversationObject);
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access');
		}
	}

	@SubscribeMessage('createConversation')
	async createConversation(socket: AuthenticatedSocket, data: any) {
		// const { title = "", channelID = "", password = "", privacy = "" } = { title: "default title", channelID: "default channelID", password: "default password", privacy: "default privacy" };


		// const conversation = await this.conversationService.create({
		//   title: title,
		//   creator_id: data,
		//   channel_id: channelID,
		//   password: password,
		//   privacy: privacy,
		// });
		// console.log(conversation);
		// await this.participantService.create({
		//   conversation_id: conversation.id,
		//   user_id: data,
		// });

		// socket.emit('conversationCreated', conversation);
	}



	//   @SubscribeMessage('joinConversation')
	//   async joinConversation(socket: AuthenticatedSocket, @MessageBody() data: any) {
	//     const { conversationID } = data;

	//     const participant = await this.participantService.getConversation(socket.user.id, conversationID);

	//     if (!participant) {
	//       await this.participantService.create({
	//         conversation_id: conversationID,
	//         user_id: socket.user.id,
	//       });

	//       socket.join(conversationID);

	//       socket.to(conversationID).emit('userJoined', { userID: socket.user.id });
	//     }
	//   }

	//   @SubscribeMessage('leaveConversation')
	//   async leaveConversation(socket: AuthenticatedSocket, @MessageBody() data: any) {
	//     const { conversationID } = data;

	//     const participant = await this.participantService.getConversation(socket.user.id, conversationID);

	//     if (participant) {
	//       await this.participantService.remove(participant.id);

	//       socket.leave(conversationID);

	//       socket.to(conversationID).emit('userLeft', { userID: socket.user.id });
	//     }
	//   }



	//   @SubscribeMessage('deleteMessage')
	//   async deleteMessage(socket: AuthenticatedSocket, @MessageBody() data: any) {
	//     const { messageID } = data;

	//     const message = await this.messageService.findOne(messageID);

	//     if (message && message.author_id === socket.user.id) {
	//       await this.messageService.remove(messageID);

	//       socket.to(message.conversation_id).emit('messageDeleted', messageID);
	//     }
	//   }

	//   @SubscribeMessage('blockUser')
	//   async blockUser(socket: AuthenticatedSocket, @MessageBody() data: any) {
	//     const { userID } = data;

	//     const participant = await this.participantService.getConversation(socket.user.id, userID);

	//     if (!participant) {
	//       await this.participantService.create({
	//         conversation_id: socket.user.id,
	//         user_id: userID,
	//       });

	//       socket.emit('userBlocked', { userID });
	//     }
	//   }

	//   @SubscribeMessage('unblockUser')
	//   async unblockUser(socket: AuthenticatedSocket, @MessageBody() data: any) {
	//     const { userID } = data;

	//     const participant = await this.participantService.getConversation(socket.user.id, userID);

	//     if (participant) {
	//       await this.participantService.remove(participant.id);

	//       socket.emit('userUnblocked', { userID });
	//     }
	//   }

	//   @SubscribeMessage('updateConversation')
	//   async updateConversation(socket: AuthenticatedSocket, @MessageBody() data: any) {
	//     const { conversationID, title, privacy } = data;

	//     const conversation = await this.conversationService.findOne(conversationID);

	//     if (conversation && conversation.creator_id === socket.user.id) {
	//       const updatedConversation = await this.conversationService.update(conversationID, {
	//         title,
	//         privacy,
	//       });

	//       socket.to(conversationID).emit('conversationUpdated', updatedConversation);
	//     }
	//   }

	//   @SubscribeMessage('setConversationPassword')
	//   async setConversationPassword(socket: AuthenticatedSocket, @MessageBody() data: any) {
	//     const { conversationID, password } = data;

	//     const conversation = await this.conversationService.findOne(conversationID);

	//     if (conversation && conversation.creator_id === socket.user.id) {
	//       const updatedConversation = await this.conversationService.update(conversationID, {
	//         password,
	//       });

	//       socket.to(conversationID).emit('conversationUpdated', updatedConversation);
	//     }
	//   }

	//   @SubscribeMessage('removeConversationPassword')
	//   async removeConversationPassword(socket: AuthenticatedSocket, @MessageBody() data: any) {
	//     const { conversationID } = data;

	//     const conversation = await this.conversationService.findOne(conversationID);

	//     if (conversation && conversation.creator_id === socket.user.id) {
	//       const updatedConversation = await this.conversationService.update(conversationID, {
	//         password: null,
	//       });

	//       socket.to(conversationID).emit('conversationUpdated', updatedConversation);
	//     }
	//   }

	//   @SubscribeMessage('setConversationPrivacy')
	//   async setConversationPrivacy(socket: AuthenticatedSocket, @MessageBody() data: any) {
	//     const { conversationID, privacy } = data;

	//     const conversation = await this.conversationService.findOne(conversationID);

	//     if (conversation && conversation.creator_id === socket.user.id) {
	//       const updatedConversation = await this.conversationService.update(conversationID, {
	//         privacy,
	//       });

	//       socket.to(conversationID).emit('conversationUpdated', updatedConversation);
	//     }
	//   }

	//   @SubscribeMessage('setConversationAdmin')
	//   async setConversationAdmin(socket: AuthenticatedSocket, @MessageBody() data: any) {
	//     const { conversationID, userID } = data;

	//     const conversation = await this.conversationService.findOne(conversationID);

	//     if (conversation && conversation.creator_id === socket.user.id) {
	//       const participant = await this.participantService.getConversation(userID, conversationID);

	//       if (participant) {
	//         await this.participantService.update(participant.id, {
	//           role: Role.ADMIN
	//         });

	//         socket.to(conversationID).emit('userAdminSet', { userID });
	//       }
	//     }
	//   }

	//   @SubscribeMessage('kickUser')
	//   async kickUser(socket: AuthenticatedSocket, @MessageBody() data: any) {
	//     const { conversationID, userID } = data;

	//     const conversation = await this.conversationService.findOne(conversationID);

	//     if (conversation && conversation.creator_id === socket.user.id) {
	//       const participant = await this.participantService.getConversation(userID, conversationID);

	//       if (participant) {
	//         await this.participantService.remove(participant.id);

	//         socket.to(conversationID).emit('userKicked', { userID });
	//       }
	//     }
	//   }
}
