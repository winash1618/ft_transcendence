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
import { randomUUID } from 'crypto';
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
					participant: participants[i],
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
			// socket.emit('alert', 'Connected');
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access fron handleConnection');
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
			// socket.emit('alert', 'Message sent');
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access from sendMessage');
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
			let ConversationObjectArray = [];
			if (conversation.privacy === Privacy.DIRECT) {
				ConversationObjectArray = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, data.privacy);
			}
			else {
				const ConversationObjectArray1 = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, Privacy.PUBLIC);
				const ConversationObjectArray2 = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, Privacy.PRIVATE);
				const ConversationObjectArray3 = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, Privacy.PROTECTED);
				ConversationObjectArray = ConversationObjectArray1.concat(ConversationObjectArray2, ConversationObjectArray3);
			}
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
					participant: participants[i],
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
			// socket.emit('alert', 'Conversation reloaded');
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access from reloadConversations');
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
					participant: participants[i],
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
			socket.emit('alert', 'Direct conversations reloaded');
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access from getDirectConversations');
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
			const GroupConversationObjectArray1 = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, Privacy.PUBLIC);
			const GroupConversationObjectArray2 = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, Privacy.PRIVATE);
			const GroupConversationObjectArray3 = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, Privacy.PROTECTED);
			const GroupConversationObjectArray = GroupConversationObjectArray1.concat(GroupConversationObjectArray2, GroupConversationObjectArray3);
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
					participant: participants[i],
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
			if (GroupConversationObjectArray.length > 0)
			{
				for (const p of GroupConversationObjectArray[0].participants) {
					const user = await this.usersService.getUserById(p.user_id);
					groupMembers.push(user);
				}
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
			socket.emit('alert', 'Group conversations reloaded');
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access from getGroupConversations');
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
			const conversation = await this.conversationService.createWithPassword({
				title: data.title,
				creator_id: user.login,
				channel_id: randomUUID(),
				password: data.password,
				privacy: (data.privacy === "public") ? Privacy.PUBLIC : ((data.privacy === "private") ? Privacy.PRIVATE : Privacy.PROTECTED),
			});
			if (conversation.privacy === Privacy.PUBLIC) {
				socket.emit('alert', 'public conversation created');
			}
			if (conversation.privacy === Privacy.PRIVATE) {
				socket.emit('alert', 'private conversation created');
			}
			if (conversation.privacy === Privacy.PROTECTED) {
				socket.emit('alert', 'protected conversation created');
			}
			const participant = await this.participantService.createParticipantWithRole({
				conversation_id: conversation.id,
				user_id: user.id,
				role: Role.ADMIN,
			});
			const conversationObject = {
				id: conversation.id,
				title: conversation.title,
				privacy: conversation.privacy,
				participant_id: participant.id,
				participant: participant,
				creator_id: conversation.creator_id,
				channel_id: conversation.channel_id,
				created_at: conversation.created_at,
				updated_at: conversation.updated_at,
				participants: conversation.participants,
				messages: conversation.messages,
			}
			socket.emit('conversationCreated', conversationObject);
			socket.emit('alert', 'conversation created');
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access from createConversation');
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
			socket.join(conversation.id);
			await this.participantService.create({
				conversation_id: conversation.id,
				user_id: user.id,
			});
			await this.participantService.create({
				conversation_id: conversation.id,
				user_id: data.id,
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
			i = 0;
			DirectConversationObjectArray.forEach((c) => {
				ConversationObjectArrayWithParticipantId.push({
					id: c.id,
					title: c.title,
					privacy: c.privacy,
					participant_id: participants[i].id,
					participant: participants[i],
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
			socket.emit('alert', 'direct conversation created');
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access from createDirectConversation');
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
			socket.emit('alert', 'user added to group');
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access from addUserToGroup');
		}
	}

	@SubscribeMessage('ListConversations')
	async ListConversations(socket: AuthenticatedSocket) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const ConversationListPublic = await this.conversationService.getConversationByPrivacy(Privacy.PUBLIC);
			const ConversationListProtected = await this.conversationService.getConversationByPrivacy(Privacy.PROTECTED);
			const ConversationList = ConversationListPublic.concat(ConversationListProtected);
			const ConversationUserIsParticipantListPublic = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, Privacy.PUBLIC);
			const ConversationUserIsParticipantListProtected = await this.conversationService.getConversationByUserIdAndPrivacy(user.id, Privacy.PROTECTED);
			const ConversationUserIsParticipantList = ConversationUserIsParticipantListPublic.concat(ConversationUserIsParticipantListProtected);
			const ConversationUserIsNotParticipantList = [];
			ConversationList.forEach((c) => {
				let found = false;
				ConversationUserIsParticipantList.forEach((c2) => {
					if (c.id === c2.id) {
						found = true;
					}
				});
				if (!found) {
					ConversationUserIsNotParticipantList.push(c);
				}
			});

			socket.emit('ConversationsListed', ConversationUserIsNotParticipantList);
			socket.emit('alert', 'Conversations listed');
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access from ListConversations');
		}
	}

	@SubscribeMessage('joinPublicConversation')
	async joinConversation(socket: AuthenticatedSocket, data: any) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const conversation = await this.conversationService.getConversationWithParticipants(data);
			const participant = await this.participantService.create({ user_id: user.id, conversation_id: data });
			if (conversation.participants.length === 0) {
				await this.prisma.participant.update({ where: { id: participant.id }, data: { role: Role.ADMIN } });
			}
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access from joinPublicConversation');
		}
	}

	@SubscribeMessage('joinProtectedConversation')
	async joinProtectedConversation(socket: AuthenticatedSocket, data: any) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const conversation = await this.conversationService.getConversationWithParticipants(data.conversation_id);
			if (conversation.password === data.password) {
				const participant = await this.participantService.create({ user_id: user.id, conversation_id: data.conversation_id });
				if (conversation.participants.length === 0) {
					await this.prisma.participant.update({ where: { id: participant.id }, data: { role: Role.ADMIN } });
				}
				socket.emit('protectedConversationJoined', conversation);
				socket.emit('alert', 'protected conversation joined');
			}
			else {
				socket.emit('error', 'Wrong password');
			}
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access from joinProtectedConversation');
		}
	}

	@SubscribeMessage('leaveConversation')
	async leaveConversation(socket: AuthenticatedSocket, data: any) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			await this.prisma.message.deleteMany({
				where: {
					conversation_id: data.conversation_id,
					author_id: data.participant_id,
				}
			});
			await this.prisma.participant.delete({
				where: {
					conversation_id_user_id: {
						conversation_id: data.conversation_id,
						user_id: user.id,
					}
				}
			});
			socket.emit('alert', '{user} left the conversation');
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access from leaveConversation');
		}
	}

	@SubscribeMessage('changePassword')
	async changePassword(socket: AuthenticatedSocket, data: any) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const conversation = await this.conversationService.getConversationWithParticipants(data.conversation_id);
			if (conversation.privacy === Privacy.PUBLIC) {
				await this.prisma.conversation.update({
					where: {
						id: data.conversation_id,
					},
					data: {
						password: data.password,
						privacy: Privacy.PROTECTED,
					}
				});
				socket.emit('alert', 'Password changed, conversation is now protected');
			}
			else {
				if (conversation.password === data.password) {
					socket.emit('alert', 'Enter new password');
				}
				else {
					await this.prisma.conversation.update({
						where: {
							id: data.conversation_id,
						},
						data: {
							password: data.password,
						}
					});
					socket.emit('alert', 'Password changed');
				}
			}
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access from changePassword');
		}
	}

	@SubscribeMessage('removePassword')
	async removePassword(socket: AuthenticatedSocket, data: any) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			await this.prisma.conversation.update({
				where: {
					id: data.conversation_id,
				},
				data: {
					password: null,
					privacy: Privacy.PUBLIC,
				}
			});
			socket.emit('alert', 'Password removed');
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access from removePassword');
		}
	}

	@SubscribeMessage('makeAdmin')
	async makeAdmin(socket: AuthenticatedSocket, data: any) {
		const token = socket.handshake.auth.token;
		let user = null;
		try {
			user = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			const conversation = await this.conversationService.getConversationWithParticipants(data.conversation_id);
			let isAdmin = false;
			let participantObject = null;
			conversation.participants.forEach(async (participant) => {
				if (participant.user_id === data.user_id){
					if (participant.role === Role.ADMIN)
					{
						socket.emit('error', 'Participant is already admin');
						isAdmin = true;
					}
					participantObject = participant;
				}
			});
			if (!isAdmin) {
				await this.prisma.participant.update({
					where: {
						id: participantObject.id,
					},
					data: {
						role: Role.ADMIN,
					}
				});
				socket.emit('alert', 'Participant is now admin');
			}
		}
		catch (e) {
			socket.emit('error', 'Unauthorized access from makeAdmin');
		}
	}
}
