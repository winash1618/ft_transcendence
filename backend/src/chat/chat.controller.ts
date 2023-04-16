import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseFilters,
  ParseUUIDPipe,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';
import { JwtAuthGuard } from 'src/utils/guards/jwt.guard';
import { ChatService } from './chat.service';
import { ConversationService } from './Queries/conversation.service';
import { ParticipantService } from './Queries/participant.service';
import { MessageService } from './Queries/message.service';

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
  ) {}

  @Get('direct')
  async getConversations(@Req() req, @Res() res: Response) {
    try {
      const conversation = await this.conversationService.getDirectConversations(req.user.id);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Conversations retrieved successfully', conversation });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':conversationID/members')
  async getParticipants(
    @Param('conversationID', ParseUUIDPipe) conversationID: string,
    @Res() res: Response,
  ) {
    try {
      const participants = await this.participantService.getParticipants(conversationID);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Participants retrieved successfully', participants });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('groups')
  async getChannels(@Req() req, @Res() res: Response) {
    try {
      const channels = await this.conversationService.getChannels(req.user.id);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Channels retrieved successfully', channels });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':conversationID/messages')
  async getMessages(
    @Param('conversationID') conversationID: string,
    @Res() res: Response,
  ) {
    try {
      const conversations =
        await this.messageService.getDisplayMessagesByConversationID(
          conversationID,
        );
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Messages retrieved successfully', conversations });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('explore')
  async searchChannels(@Req() req, @Res() res: Response) {
    try {
      const channels = await this.conversationService.findChannelsThatUserIsNotIn(
        req.user.id,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Channels retrieved successfully', channels });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('channel/:channelID/banned')
  async getBannedUsers(
    @Param('channelID', ParseUUIDPipe) channelID: string,
    @Res() res: Response,
  ) {
    try {
      const participants = await this.participantService.bannedUsers(channelID);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Banned users retrieved successfully', participants });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('channel/:channelID/addFriends')
  async getFriendsToAddToChannel(
    @Param('channelID', ParseUUIDPipe) channelID: string,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const friends = await this.conversationService.friendsNotInConversation(
        channelID,
        req.user.id,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Friends retrieved successfully', friends });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
