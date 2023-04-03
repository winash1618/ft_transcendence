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
					login: u.login,
					id: u.id,
					username: u.username,
				});
			});
			const DirectConversationObjectArray = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, Privacy.DIRECT);
			const ConversationObjectArrayWithParticipantId = [];
			const participants = [];
			for (const object of DirectConversationObjectArray) {
				const participant = await this.participantService.getParticipant(object.id, user.id);
				participants.push(participant[0]);
			}
			let i = 0;
			const ListOfDirectConversationUsers = [];
			DirectConversationObjectArray.forEach((c) => {
				c.participants.forEach((p) => {
					if (p.id !== participants[i].id) {
						const user = ListOfAllUsersObject.find((u) => u.id === p.user_id);
						ListOfDirectConversationUsers.push({
							login: user.login,
							username: user.username,
						});
					}
				});
				i++;
			});
			i = 0;
			DirectConversationObjectArray.forEach((c) => {
				socket.join(c.id);
				ConversationObjectArrayWithParticipantId.push({
					id: c.id,
					title: c.title,
					privacy: c.privacy,
					participant_id: participants[i].id,
					user: ListOfDirectConversationUsers[i],
					creator_id: c.creator_id,
					channel_id: c.channel_id,
					created_at: c.created_at,
					updated_at: c.updated_at,
					participants: c.participants,
					messages: c.messages,
				});
				i++;
			});
			console.log("Rooms: ", socket.rooms);
			const objectToEmit = {
				conversations: ConversationObjectArrayWithParticipantId,
				ListOfAllUsers: ListOfAllUsersObject,
			};
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
			await this.messageService.create({
				conversation_id: data.conversation_id,
				author_id: participant[0].id,
				message: data.content,
			});
			data.author_id = participant[0].id;
			// data.myParticipantID = participant[0].id;
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
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const groupMembers = [];
			const otherUsers = [];
			const conversation = await this.conversationService.getConversationWithParticipants(data.id);
			const ListOfAllUsers = await this.prisma.user.findMany();
			const ListOfAllUsersWithoutMe = ListOfAllUsers.filter((u) => u.id !== user.id);
			const ListOfAllUsersObject = [];
			ListOfAllUsersWithoutMe.forEach((u) => {
				ListOfAllUsersObject.push({
					login: u.login,
					id: u.id,
					username: u.username,
				});
			});
			for (const p of conversation.participants) {
				const user = await this.usersService.getUserById(p.user_id);
				groupMembers.push(user);
			}
			ListOfAllUsersWithoutMe.forEach((u) => {
				let found = false;
				groupMembers.forEach((u2) => {
					if (u.id === u2.id) {
						found = true;
					}
				});
				if (!found) {
					otherUsers.push(u);
				}
			});
			const ConversationObjectArray = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, data.privacy);
			const participants = [];
			for (const object of ConversationObjectArray) {
				const participant = await this.participantService.getParticipant(object.id, user.id);
				participants.push(participant[0]);
			}
			const ConversationObjectArrayWithParticipantId = [];
			let i = 0;
			const ListOfConversationUsers = [];
			ConversationObjectArray.forEach((c) => {
				c.participants.forEach((p) => {
					if (p.id !== participants[i].id) {
						const user = ListOfAllUsersObject.find((u) => u.id === p.user_id);
						ListOfConversationUsers.push({
							login: user.login,
							username: user.username,
						});
					}
				});
				i++;
			});
			i = 0;
			ConversationObjectArray.forEach((c) => {
				socket.join(c.id);
				ConversationObjectArrayWithParticipantId.push({
					id: c.id,
					title: c.title,
					privacy: c.privacy,
					participant_id: participants[i].id,
					user: ListOfConversationUsers[i],
					creator_id: c.creator_id,
					channel_id: c.channel_id,
					created_at: c.created_at,
					updated_at: c.updated_at,
					participants: c.participants,
					messages: c.messages,
				});
				i++;
			});
			
			const reloadObject = {
				conversations: ConversationObjectArrayWithParticipantId,
				groupMembers: groupMembers,
				otherUsers: otherUsers,
			}
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
			const ListOfAllUsers = await this.prisma.user.findMany();
			const ListOfAllUsersWithoutMe = ListOfAllUsers.filter((u) => u.id !== user.id);
			const ListOfAllUsersObject = [];
			ListOfAllUsersWithoutMe.forEach((u) => {
				ListOfAllUsersObject.push({
					login: u.login,
					id: u.id,
					username: u.username,
				});
			});
			const DirectConversationObjectArray = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, Privacy.DIRECT);
			const ConversationObjectArrayWithParticipantId = [];
			const participants = [];
			for (const object of DirectConversationObjectArray) {
				const participant = await this.participantService.getParticipant(object.id, user.id);
				participants.push(participant[0]);
			}
			let i = 0;
			const ListOfDirectConversationUsers = [];
			DirectConversationObjectArray.forEach((c) => {
				c.participants.forEach((p) => {
					if (p.id !== participants[i].id) {
						const user = ListOfAllUsersObject.find((u) => u.id === p.user_id);
						ListOfDirectConversationUsers.push({
							login: user.login,
							username: user.username,
						});
					}
				});
				i++;
			});
			console.log(ListOfDirectConversationUsers);

			i = 0;
			DirectConversationObjectArray.forEach((c) => {
				socket.join(c.id);
				ConversationObjectArrayWithParticipantId.push({
					id: c.id,
					title: c.title,
					privacy: c.privacy,
					participant_id: participants[i].id,
					user: ListOfDirectConversationUsers[i],
					creator_id: c.creator_id,
					channel_id: c.channel_id,
					created_at: c.created_at,
					updated_at: c.updated_at,
					participants: c.participants,
					messages: c.messages,
				});
				i++;
			});
			const objectToEmit = {
				conversations: ConversationObjectArrayWithParticipantId,
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
			const ConversationObjectArrayWithParticipantId = [];
			const participants = [];
			for (const object of GroupConversationObjectArray) {
				const participant = await this.participantService.getParticipant(object.id, user.id);
				participants.push(participant[0]);
			}
			let i = 0;
			GroupConversationObjectArray.forEach((c) => {
				socket.join(c.id);
				ConversationObjectArrayWithParticipantId.push({
					id: c.id,
					title: c.title,
					privacy: c.privacy,
					participant_id: participants[i].id,
					creator_id: c.creator_id,
					channel_id: c.channel_id,
					created_at: c.created_at,
					updated_at: c.updated_at,
					participants: c.participants,
					messages: c.messages,
				});
				i++;
			});
			// get all users in the database then select all the users in the ConversationObjectArrayWithParticipantId[0]
			const groupMembers = [];
			const otherUsers = [];
			const ListOfAllUsers = await this.prisma.user.findMany();
			const ListOfAllUsersWithoutMe = ListOfAllUsers.filter((u) => u.id !== user.id);
			for (const p of GroupConversationObjectArray[0].participants) {
				const user = await this.usersService.getUserById(p.user_id);
				groupMembers.push(user);
			}
			ListOfAllUsersWithoutMe.forEach((u) => {
				let found = false;
				groupMembers.forEach((u2) => {
					if (u.id === u2.id) {
						found = true;
					}
				});
				if (!found) {
					otherUsers.push(u);
				}
			});
			const ObjectToEmit = {
				conversations: ConversationObjectArrayWithParticipantId,
				groupMembers: groupMembers,
				otherUsers: otherUsers,
			}
			socket.emit('getGroupConversations', ObjectToEmit);
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access');
		}
	}

	@SubscribeMessage('createConversation')
	async createConversation(socket: AuthenticatedSocket, data: any) {
		const token = socket.handshake.auth.token;
		let user = null;

		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const conversation = await this.conversationService.create({
				title: data.title,
				creator_id: user.id,
				channel_id: "channelID",
				password: "password",
				privacy: (data.privacy === "public") ? Privacy.PUBLIC : ((data.privacy === "private") ? Privacy.PRIVATE : Privacy.PROTECTED),
			});
			await this.participantService.create({
				conversation_id: conversation.id,
				user_id: user.id,
			});
			socket.emit('conversationCreated', conversation);

		}
		catch (e) {
			socket.emit('error', 'Unauthorized access');
		}
	}

	@SubscribeMessage('createDirectConversation')
	async createDirectConversation(socket: AuthenticatedSocket, data: any) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const conversation = await this.conversationService.create({
				title: "direct",
				creator_id: user.id,
				channel_id: "channelID",
				password: "password",
				privacy: Privacy.DIRECT,
			});

			await this.participantService.create({
				conversation_id: conversation.id,
				user_id: user.id,
			});
			await this.participantService.create({
				conversation_id: conversation.id,
				user_id: data.id,
			});
			console.log("Conversation created",	conversation);

			const ListOfAllUsers = await this.prisma.user.findMany();
			const ListOfAllUsersWithoutMe = ListOfAllUsers.filter((u) => u.id !== user.id);
			const ListOfAllUsersObject = [];
			ListOfAllUsersWithoutMe.forEach((u) => {
				ListOfAllUsersObject.push({
					login: u.login,
					id: u.id,
					username: u.username,
				});
			});
			const DirectConversationObjectArray = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, Privacy.DIRECT);
			const ConversationObjectArrayWithParticipantId = [];
			const participants = [];
			for (const object of DirectConversationObjectArray) {
				const participant = await this.participantService.getParticipant(object.id, user.id);
				participants.push(participant[0]);
			}
			let i = 0;
			const ListOfDirectConversationUsers = [];
			DirectConversationObjectArray.forEach((c) => {
				c.participants.forEach((p) => {
					if (p.id !== participants[i].id) {
						const user = ListOfAllUsersObject.find((u) => u.id === p.user_id);
						ListOfDirectConversationUsers.push({
							login: user.login,
							username: user.username,
						});
					}
				});
				i++;
			});
			// console.log(ListOfDirectConversationUsers);

			i = 0;
			DirectConversationObjectArray.forEach((c) => {
				ConversationObjectArrayWithParticipantId.push({
					id: c.id,
					title: c.title,
					privacy: c.privacy,
					participant_id: participants[i].id,
					user: ListOfDirectConversationUsers[i],
					creator_id: c.creator_id,
					channel_id: c.channel_id,
					created_at: c.created_at,
					updated_at: c.updated_at,
					participants: c.participants,
					messages: c.messages,
				});
				i++;
			});
			console.log(ConversationObjectArrayWithParticipantId);
			const objectToEmit = {
				conversations: ConversationObjectArrayWithParticipantId,
			}
			socket.emit('getDirectConversations', objectToEmit);
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access');
		}
	}


	@SubscribeMessage('addUserToGroup')
	async addUserToGroup(socket: AuthenticatedSocket, data: any) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const conversation = await this.conversationService.getConversationWithParticipants(data.conversationId);
			const userToAdd = await this.usersService.getUserByLogin(data.userLogin);
			await this.participantService.create({
				conversation_id: conversation.id,
				user_id: userToAdd.id,
			});
			// const groupMembers = [];
			// const otherUsers = [];
			// const ListOfAllUsers = await this.prisma.user.findMany();
			// const ListOfAllUsersWithoutMe = ListOfAllUsers.filter((u) => u.id !== user.id);
			// for (const p of conversation.participants) {
			// 	const user = await this.usersService.getUserById(p.user_id);
			// 	groupMembers.push(user);
			// }
			// ListOfAllUsersWithoutMe.forEach((u) => {
			// 	let found = false;
			// 	groupMembers.forEach((u2) => {
			// 		if (u.id === u2.id) {
			// 			found = true;
			// 		}
			// 	});
			// 	if (!found) {
			// 		otherUsers.push(u);
			// 	}
			// });
			// const ObjectToEmit = {
			// 	groupMembers: groupMembers,
			// 	otherUsers: otherUsers,
			// }
			// socket.emit('userAddedToGroup', ObjectToEmit);
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access');
		}
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
