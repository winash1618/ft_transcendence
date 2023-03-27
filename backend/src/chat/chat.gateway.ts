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
		// console.log("Socket: ", socket);
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			console.log("User: ", user);
			// what we need to when we are connnecting to the socket
			// we need find all the conversations that the user is in
			// then we need to get all the messages for each conversation
			// then we need to list all the available users that the user can chat with
			// So now let's plan how to do this
			// first we are going to get all the available users with their id, name and profile picture
			// second we are going to get all the conversations that the user is in
			// the conversation object will have conversation id, title, participants
			// then we are going to get all the messages for each conversation from the message table


			// So how are we going to create the socket rooms
			// we are going to create a room for each conversation with the conversation id as the room name
			// and we are going to make everyone join the room with their respective conversation id
			// so that when we send a message to a particular conversation we can send it to the room with the conversation id


			// So now what we need is the conversation Id's at the front end
			// and we need to list all the participants in the conversation other than the current user
			// if it is a group conversation then we need to list the title of the conversation
			/* 
				object = [
					{
						conversation_id: conversation_id,
						title: title,
						participants: [participant1, participant2, participant3, ...], MyselfNotincluded
					},
					{
						conversation_id: conversation_id,
						title: title,
						participants: [participant1, participant2, participant3, ...], MyselfNotincluded
					},
					...

				]
			*/



			// const participantsList = [];
			// conversations.forEach((p) => {
			// 	participantsList.push({
			// 		conversation_id: p.conversation_id,
			// 	  });
			// });
			// console.log("Participants List: ", participantsList);

			// // join the socket to the room with the conversation id
			// participants.forEach((p) => {
			// 	socket.join(p.conversation_id);
			// });




			const ListOfAllUsers = await this.prisma.user.findMany();
			console.log("List of all users: ", ListOfAllUsers);
			const ListOfAllUsersWithoutMe = ListOfAllUsers.filter((u) => u.id !== user.id);
			console.log("List of all users without me: ", ListOfAllUsersWithoutMe);
			// get User object with user id and login status from ListOfAllUsersWithoutMe
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
			// const conversations = [];
			const conversations = participants[0].conversation.map(conversation => ({
				  ...conversation,
				}));

			console.log("Conversations: ", conversations);
			conversations.forEach((c) => {
				socket.join(c.id);
			});
			console.log("Rooms: ", socket.rooms);

			// So now we have conversation list.
			// Now we need to get the convesation object to the front end
			// So we need to get the conversation object from the conversation table
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

			console.log("Conversation Object: ", flattenedConversationObjects);



			// console.log(users);
			// const users = await this.prisma.user.findMany();
			// console.log("Users: ", users);
			// const socketId = socket.id;
			// const userObject = {	users: users,  socketId: socketId };
			// const participant = await this.participantService.getParticipantsByUserID("f259dca5-fd72-4c34-97a4-c783f60f54b6");
			// console.log(participant);
			// participant.forEach(async (p) => {
			// 	const conversationID = p.conversation_id;
			// 	const messages = await this.prisma.message.findMany({
			// 	  where: { conversation_id: conversationID },
			// 	  include: { author: true },
			// 	  orderBy: { created_at: 'asc' },
			// 	});
			// 	console.log("Messages: ", messages);
			// });
			// first we get the participants from the participant table
			// then for each participant we check coversation id if there only 2 participants
			// then we get the messages for that converation id for the personnel messages
			// then check convesation id if there are more than 2 participants
			// then we get the messages for that converation id for the group messages 
			// add this to a dictionary with the conversation id as the key and number of participants as the value
			// listOfSocketIDs.push(socket.id);
			// console.log("Socket handshake query: ", socket.handshake.query);
			// socket.emit('availableUsers', users);
			// const userObject = await this.prisma.user.findUnique({
			// 	where: { id: user.id },
			// 	include: { conversations: true, participant_in: true },
			// });
			// console.log("successfully emitted");
			// // console.log("Conversations: ", conversations);
			// userObject.conversations.forEach((c) => {
			// 	socket.join(c.id);
			// });
			// const participantsList = userObject.participant_in;
			// console.log("Participants List: ", participantsList);

			// const conversations = [];
			// for (const c of userObject.conversations) {
			// 	const participants = [];
			// 	for (const p of userObject.participant_in) {
			// 	  if (p.conversation_id === c.id) {
			// 		const userObject = await this.prisma.user.findUnique({
			// 		  where: { id: p.user_id },
			// 		});
			// 		console.log("User Object mine: ", userObject);
			// 		participants.push({
			// 		  login: userObject.login,
			// 		  username: userObject.username,
			// 		});
			// 	  }
			// 	}
			// 	const conversation = {
			// 	  conversation_id: c.id,
			// 	  title: c.title,
			// 	  participants: participants,
			// 	};
			// 	conversations.push(conversation);
			//   }

			// console.log("Conversations: ", conversations);

			// // get users from conversations.participants
			// const users = [];
			// conversations.forEach((c) => {
			// 	c.participants.forEach((p) => {
			// 		if (p.user_id !== user.id) {
			// 			users.push(p);
			// 		}
			// 	})
			// });
			// console.log("Users: ", users);



			// // create object to emit
			// const objectToEmit = {
			// 	conversations: conversations,
			// 	users: users,
			// 	ListOfAllUsers: ListOfAllUsersObject
			// }
			// get the user object for each user
			// const userObjects = [];
			// for (const u of users) {
			// const userObject = await this.prisma.user.findUnique({
			// 	where: { id: u },
			// });
			// userObjects.push({
			// 	username: userObject.login,

			// });
			// }
			// console.log("User Objects: ", userObjects);

			const objectToEmit = {
				conversations: flattenedConversationObjects,
				ListOfAllUsers: ListOfAllUsersObject
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
			// console.log("User: ", user);

			// const userObject = data.user;
			// const participant = await this.participantService.getParticipantsByUserID(userObject.id);
			// console.log("participant: ", participant);
			// const conversationID = participant[0].conversation_id;
			// console.log("conversationID: ", conversationID);
			// const messageSent = await this.messageService.create({
			//   conversation_id: conversationID,
			//   author_id: user.id,
			//   message: data.message,
			// });


			// const userObject = await this.prisma.user.findUnique({
			// 	where: {
			// 		login: user.login,
			// 	},
			// });
			// console.log("User Object: ", userObject);
			// const participants = await this.participantService.getParticipantsByUserID(userObject.id);
			// console.log("participants: ", participants);
			// participants.forEach((p) => {
			// 	this.server.to(p.conversation_id).emit("sendMessage",data);
			// });
			// this.server.to("mkaruvan").emit("sendMessage",data);
			// console.log("Sending Success");
			// console.log("Data: ", data);
			const participant = await this.participantService.getParticipantsByUserID(user.id);
			console.log("Participant: ", participant);
			await this.messageService.create({
				conversation_id: data.conversation_id,
				author_id: participant.id,
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
