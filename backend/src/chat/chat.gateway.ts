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
import { Privacy, Role } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
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
		private usersService: UsersService
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
			const DirectConversationObjectArray = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, Privacy.DIRECT);
			console.log("Conversations: ", DirectConversationObjectArray);
			const ConversationObjectArray = await this.conversationService.getConversationByUserId(user.id);
			console.log("Conversations: ", ConversationObjectArray);
			ConversationObjectArray.forEach((c) => {
				socket.join(c.id);
			});
			console.log("Rooms: ", socket.rooms);
			const participant = await this.participantService.getParticipant(DirectConversationObjectArray[0].id, user.id);
			const objectToEmit = {
				conversations: DirectConversationObjectArray,
				ListOfAllUsers: ListOfAllUsersObject,
				participant_id: participant[0].id,
			}

			socket.emit('availableUsers', objectToEmit);
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access');
		}
	}

	@SubscribeMessage('sendMessage')
	async sendMessage(socket: AuthenticatedSocket, data: any) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
		const participant = await this.participantService.getParticipant(data.conversation_id, user.id);
		console.log("Participant: ", participant);
		await this.messageService.create({
			conversation_id: data.conversation_id,
			author_id: participant[0].id,
			message: data.content,
		});
		this.server.to(data.conversation_id).emit('sendMessage', data);
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access');
		}
	}

	handleDisconnect(socket: AuthenticatedSocket) {
		// const userID = socket.handshake.query.userID as string;
		// const conversationID = socket.handshake.query.conversationID as string;

		// console.log('User disconnected: ', userID, conversationID);

		// socket.to(conversationID).emit('userLeft', { userID });
	}

	@SubscribeMessage('reloadConversations')
	async reloadConversations(socket: AuthenticatedSocket, data: any) {
		console.log("Reloading Conversations");
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			console.log("Data1: ", data);
			console.log("Data2: conversation id: " , data.id);
			const participant = await this.participantService.getParticipant(data.id, user.id);
			console.log("Participant1: ", participant);
			const ConversationObjectArray = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, data.privacy);
			const currentConversation = ConversationObjectArray.filter((c) => c.id === data.id);
			// if conversation object array is empty or more than 1, then return error
			console.log("Current Conversation: ", currentConversation);
			const reloadObject = {
				conversations: ConversationObjectArray,
				myParticipantID: participant[0].id,
				currentConversation: currentConversation[0],
			}
			console.log("Reload Object: ", reloadObject);
			socket.emit('reloadConversations', reloadObject);
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access');
		}
	}

	@SubscribeMessage('getDirectConversations')
	async getDirectConversations(socket: AuthenticatedSocket) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const DirectConversationObjectArray = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, Privacy.DIRECT);
			console.log("Conversations This: ", DirectConversationObjectArray[0]);
			const participant = await this.participantService.getParticipant(DirectConversationObjectArray[0].id, user.id);
			console.log("Participant: ", participant);
			const objectToEmit = {
				conversations: DirectConversationObjectArray,
				myParticipantID: participant[0].id,
			}
			socket.emit('getDirectConversations', objectToEmit);
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access');
		}
	}
	@SubscribeMessage('getGroupConversations')
	async getGroupConversations(socket: AuthenticatedSocket) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const GroupConversationObjectArray = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, Privacy.PUBLIC);
			console.log("Conversations: ", GroupConversationObjectArray);
			const participant = await this.participantService.getParticipant(GroupConversationObjectArray[0].id, user.id);
			console.log("Participant1: ", participant);
			const ObjectToEmit = {
				conversations: GroupConversationObjectArray,
				myParticipantID: participant[0].id,
			}
			socket.emit('getGroupConversations', ObjectToEmit);
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
