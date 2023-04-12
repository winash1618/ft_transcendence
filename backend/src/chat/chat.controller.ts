import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseFilters, ParseUUIDPipe, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';
import { JwtAuthGuard } from 'src/utils/guards/jwt.guard';
import { ChatService } from './chat.service';
import { ConversationService } from './Queries/conversation.service';
import { ParticipantService } from './Queries/participant.service';
import { MessageService } from './Queries/message.service';
import { UsersService } from 'src/users/users.service';

@Controller('chat')
@ApiTags('chat')
@UseGuards(JwtAuthGuard)
@UseFilters(PrismaClientExceptionFilter)
export class ChatController {
	constructor(
    private readonly chatService: ChatService,
    private conversationService: ConversationService,
    private participantService: ParticipantService,
    private messageService: MessageService,
    private usersService: UsersService,
    ) { }

    @Get('direct')
    async getConversations(@Req() req) {
      try {
        // return await this.conversationService.getDirectConversations('8929f5df-7c6b-4684-9c77-0b18a3e2caa5');
        return await this.conversationService.getDirectConversations(req.user.id);
      }
      catch (error) {
        throw new NotFoundException(error.message);
      }
    }

    @Get(':conversationID/participants')
    async getParticipants(@Param('conversationID', ParseUUIDPipe) conversationID: string) {
      try {
        return await this.participantService.getParticipants(conversationID);
      }
      catch (error) {
        throw new NotFoundException(error.message);
      }
    }

    @Get('channels')
    async getChannels(@Req() req) {
      try{
        return await this.conversationService.getChannels(req.user.id);
      }
      catch (error) {
        throw new NotFoundException(error.message);
      }
    }

    @Get(':conversationID/messages')
    async getMessages(@Param('conversationID', ParseUUIDPipe) conversationID: string) {
      try {
        return await this.messageService.getDisplayMessagesByConversationID(conversationID);
      }
      catch (error) {
        throw new NotFoundException(error.message);
      }
    }

    @Get('search/channels')
    async searchChannels(@Req() req) {
      try {
        return await this.conversationService.findChannelsThatUserIsNotIn(req.user.id);
      }
      catch (error) {
        throw new NotFoundException(error.message);
      }
    }

    @Get('channel/:channelID/addFriends')
    async getFriendsToAddToChannel(@Param('channelID', ParseUUIDPipe) channelID: string, @Req() req) {
      try {
        return await this.conversationService.friendsNotInConversation(channelID, req.user.id);
      }
      catch (error) {
        throw new NotFoundException(error.message);
      }
    }

}
