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
import { AuthenticatedSocket } from 'src/utils/AuthenticatedScoket.interface';
import { PrismaService } from 'src/database/prisma.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { ParticipantService } from 'src/participant/participant.service';
import { MessageService } from 'src/message/message.service';
import { Role } from '@prisma/client';

// @WebSocketGateway()
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // @WebSocketServer() server: Server;

  // constructor(
  //   private prisma: PrismaService,
  //   private conversationService: ConversationService,
  //   private participantService: ParticipantService,
  //   private messageService: MessageService,
  //   ) {}

  // async handleConnection(socket: AuthenticatedSocket) {
  //   const userID = socket.handshake.query.userID as string;
  //   const conversationID = socket.handshake.query.conversationID as string;

  //   console.log('User connected: ', userID, conversationID);

  //   const participant = await this.participantService.getConversation(userID, conversationID);

  //   console.log('Participant: ', participant);

  //   if (!participant) {
  //     socket.disconnect();
  //     return;
  //   }

  //   socket.join(conversationID);

  //   socket.to(conversationID).emit('userJoined', { userID });

  //   const messages = await this.prisma.message.findMany({
  //     where: { conversation_id: conversationID },
  //     include: { author: true },
  //     orderBy: { created_at: 'asc' },
  //   });

  //   socket.emit('conversationHistory', messages);
  // }

  // handleDisconnect(socket: AuthenticatedSocket) {
  //   const userID = socket.handshake.query.userID as string;
  //   const conversationID = socket.handshake.query.conversationID as string;

  //   console.log('User disconnected: ', userID, conversationID);

  //   socket.to(conversationID).emit('userLeft', { userID });
  // }

  // @SubscribeMessage('createConversation')
  // async createConversation(socket: AuthenticatedSocket, @MessageBody() data: any) {
  //   const { title, channelID, password, privacy } = data;

  //   const conversation = await this.conversationService.create({
  //     title,
  //     creator_id: socket.user.id,
  //     channel_id: channelID,
  //     password,
  //     privacy,
  //   });

  //   await this.participantService.create({
  //     conversation_id: conversation.id,
  //     user_id: socket.user.id,
  //   });

  //   socket.emit('conversationCreated', conversation);
  // }

  // @SubscribeMessage('joinConversation')
  // async joinConversation(socket: AuthenticatedSocket, @MessageBody() data: any) {
  //   const { conversationID } = data;

  //   const participant = await this.participantService.getConversation(socket.user.id, conversationID);

  //   if (!participant) {
  //     await this.participantService.create({
  //       conversation_id: conversationID,
  //       user_id: socket.user.id,
  //     });

  //     socket.join(conversationID);

  //     socket.to(conversationID).emit('userJoined', { userID: socket.user.id });
  //   }
  // }

  // @SubscribeMessage('leaveConversation')
  // async leaveConversation(socket: AuthenticatedSocket, @MessageBody() data: any) {
  //   const { conversationID } = data;

  //   const participant = await this.participantService.getConversation(socket.user.id, conversationID);

  //   if (participant) {
  //     await this.participantService.remove(participant.id);

  //     socket.leave(conversationID);

  //     socket.to(conversationID).emit('userLeft', { userID: socket.user.id });
  //   }
  // }

  // @SubscribeMessage('sendMessage')
  // async sendMessage(socket: AuthenticatedSocket, @MessageBody() data: any) {
  //   const { conversationID, message } = data;

  //   const messageSent = await this.messageService.create({
  //     conversation_id: conversationID,
  //     author_id: socket.user.id,
  //     message,
  //   });

  //   socket.to(conversationID).emit('messageReceived', messageSent);
  // }

  // @SubscribeMessage('deleteMessage')
  // async deleteMessage(socket: AuthenticatedSocket, @MessageBody() data: any) {
  //   const { messageID } = data;

  //   const message = await this.messageService.findOne(messageID);

  //   if (message && message.author_id === socket.user.id) {
  //     await this.messageService.remove(messageID);

  //     socket.to(message.conversation_id).emit('messageDeleted', messageID);
  //   }
  // }

  // @SubscribeMessage('blockUser')
  // async blockUser(socket: AuthenticatedSocket, @MessageBody() data: any) {
  //   const { userID } = data;

  //   const participant = await this.participantService.getConversation(socket.user.id, userID);

  //   if (!participant) {
  //     await this.participantService.create({
  //       conversation_id: socket.user.id,
  //       user_id: userID,
  //     });

  //     socket.emit('userBlocked', { userID });
  //   }
  // }

  // @SubscribeMessage('unblockUser')
  // async unblockUser(socket: AuthenticatedSocket, @MessageBody() data: any) {
  //   const { userID } = data;

  //   const participant = await this.participantService.getConversation(socket.user.id, userID);

  //   if (participant) {
  //     await this.participantService.remove(participant.id);

  //     socket.emit('userUnblocked', { userID });
  //   }
  // }

  // @SubscribeMessage('updateConversation')
  // async updateConversation(socket: AuthenticatedSocket, @MessageBody() data: any) {
  //   const { conversationID, title, privacy } = data;

  //   const conversation = await this.conversationService.findOne(conversationID);

  //   if (conversation && conversation.creator_id === socket.user.id) {
  //     const updatedConversation = await this.conversationService.update(conversationID, {
  //       title,
  //       privacy,
  //     });

  //     socket.to(conversationID).emit('conversationUpdated', updatedConversation);
  //   }
  // }

  // @SubscribeMessage('setConversationPassword')
  // async setConversationPassword(socket: AuthenticatedSocket, @MessageBody() data: any) {
  //   const { conversationID, password } = data;

  //   const conversation = await this.conversationService.findOne(conversationID);

  //   if (conversation && conversation.creator_id === socket.user.id) {
  //     const updatedConversation = await this.conversationService.update(conversationID, {
  //       password,
  //     });

  //     socket.to(conversationID).emit('conversationUpdated', updatedConversation);
  //   }
  // }

  // @SubscribeMessage('removeConversationPassword')
  // async removeConversationPassword(socket: AuthenticatedSocket, @MessageBody() data: any) {
  //   const { conversationID } = data;

  //   const conversation = await this.conversationService.findOne(conversationID);

  //   if (conversation && conversation.creator_id === socket.user.id) {
  //     const updatedConversation = await this.conversationService.update(conversationID, {
  //       password: null,
  //     });

  //     socket.to(conversationID).emit('conversationUpdated', updatedConversation);
  //   }
  // }

  // @SubscribeMessage('setConversationPrivacy')
  // async setConversationPrivacy(socket: AuthenticatedSocket, @MessageBody() data: any) {
  //   const { conversationID, privacy } = data;

  //   const conversation = await this.conversationService.findOne(conversationID);

  //   if (conversation && conversation.creator_id === socket.user.id) {
  //     const updatedConversation = await this.conversationService.update(conversationID, {
  //       privacy,
  //     });

  //     socket.to(conversationID).emit('conversationUpdated', updatedConversation);
  //   }
  // }

  // @SubscribeMessage('setConversationAdmin')
  // async setConversationAdmin(socket: AuthenticatedSocket, @MessageBody() data: any) {
  //   const { conversationID, userID } = data;

  //   const conversation = await this.conversationService.findOne(conversationID);

  //   if (conversation && conversation.creator_id === socket.user.id) {
  //     const participant = await this.participantService.getConversation(userID, conversationID);

  //     if (participant) {
  //       await this.participantService.update(participant.id, {
  //         role: Role.ADMIN
  //       });

  //       socket.to(conversationID).emit('userAdminSet', { userID });
  //     }
  //   }
  // }

  // @SubscribeMessage('kickUser')
  // async kickUser(socket: AuthenticatedSocket, @MessageBody() data: any) {
  //   const { conversationID, userID } = data;

  //   const conversation = await this.conversationService.findOne(conversationID);

  //   if (conversation && conversation.creator_id === socket.user.id) {
  //     const participant = await this.participantService.getConversation(userID, conversationID);

  //     if (participant) {
  //       await this.participantService.remove(participant.id);

  //       socket.to(conversationID).emit('userKicked', { userID });
  //     }
  //   }
  // }
// }
