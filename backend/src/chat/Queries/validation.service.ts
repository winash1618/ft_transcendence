import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Status, Role, Privacy } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateParticipantDto } from '../dto/participants.dto';
import { ConversationService } from './conversation.service';
import { UsersService } from '../../users/users.service';
import { MessageService } from './message.service';
import { ParticipantService } from './participant.service';
import { createConversationDto } from '../dto/GatewayDTO/index.dto';

@Injectable()
export class validationService {
  constructor(
    private prisma: PrismaService,
    private conversationService: ConversationService,
    private messageService: MessageService,
    private userService: UsersService,
    private participantService: ParticipantService
  ) {}

  async validateCreateConversation(createConversationDto: createConversationDto, user: string): Promise<boolean> {
    if (!(await this.userService.checkIfUserExists(user)))
      throw new Error('User does not exist');

    if (!(await this.conversationService.validateChannelTitle(createConversationDto.title)))
      throw new Error('Conversation title already exists');

    if (createConversationDto.privacy === Privacy.DIRECT)
      throw new Error('You cannot create a direct conversation');

    if ((createConversationDto.privacy === Privacy.PROTECTED || createConversationDto.privacy === Privacy.PRIVATE) && !createConversationDto.password)
      throw new Error('You must provide a password for this conversation');


    return true;
  }

  async validateJoinConversation(conversationID: string, user: string, password?: string): Promise<boolean> {
    const conversation = await this.conversationService.checkConversationExists(conversationID);

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error('You cannot join a direct conversation');

    if (conversation.privacy === Privacy.PROTECTED && !password)
      throw new Error('You must provide a password for this conversation');

    if (conversation.privacy === Privacy.PRIVATE)
      throw new Error('You cannot join a private conversation. You must be invited.');

    const userParticipant = await this.participantService.checkParticipantExists(conversationID, user);

    if (userParticipant && (userParticipant.conversation_status === Status.ACTIVE || userParticipant.conversation_status === Status.MUTED))
      throw new Error('You are already a participant of the conversation');

    if (userParticipant && userParticipant.conversation_status === Status.BANNED)
      throw new Error('You are banned from this conversation');

    return true;
  }

  async validateLeaveConversation(conversationID: string, user: string): Promise<boolean> {
    const conversation = await this.conversationService.checkConversationExists(conversationID);

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error('You cannot leave a direct conversation');

    const userParticipant = await this.participantService.checkParticipantExists(conversationID, user);

    if (!userParticipant || userParticipant.conversation_status !== Status.ACTIVE && userParticipant.conversation_status !== Status.MUTED)
      throw new Error('You are not active in this conversation.');

    return true;
  }

  async validateAddPassword(conversationID: string, admin: string) {
    const conversation = await this.conversationService.checkConversationExists(conversationID);

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error('You cannot add a password to a direct conversation');

    const adminUser = await this.participantService.checkParticipantExists(conversationID, admin);

    if (!adminUser)
      throw new Error('Admin is not a participant of the conversation');

    if (adminUser.role === Role.USER)
      throw new Error('You are not an admin of the conversation');

    if (!adminUser || adminUser.conversation_status !== Status.ACTIVE && adminUser.conversation_status !== Status.MUTED)
      throw new Error('You are not active in this conversation.');

    if (conversation.password)
      throw new Error('Conversation already has a password');

    return true;
  }

  async validateMakeAdmin(conversationID: string, admin: string, user: string): Promise<boolean> {
    if (admin === user)
      throw new Error('You cannot make yourself an admin.');

    const conversation = await this.conversationService.checkConversationExists(conversationID);

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error('You cannot make a user an admin in a direct conversation');

    const adminUser = await this.participantService.checkParticipantExists(conversationID, admin);

    if (adminUser.role !== Role.OWNER)
      throw new Error('You are not an owner of the conversation');

    if (!adminUser || adminUser.conversation_status !== Status.ACTIVE && adminUser.conversation_status !== Status.MUTED)
      throw new Error('You are not active in this conversation.');

    const userParticipant = await this.participantService.checkParticipantExists(conversationID, user);

    if (!userParticipant || userParticipant.conversation_status !== Status.ACTIVE && userParticipant.conversation_status !== Status.MUTED)
      throw new Error('User is not a participant of the conversation');

    if (userParticipant.role === Role.OWNER)
      throw new Error('You cannot make the owner of the conversation an admin');

    if (userParticipant.role === Role.ADMIN)
      throw new Error('User is already an admin');

    return true;
  }

  async validateAddParticipant(conversationID: string, admin: string, user: string): Promise<boolean> {
    if (admin === user)
      throw new Error('You are already a part of this channel.');

    const conversation = await this.conversationService.checkConversationExists(conversationID);

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error('You cannot add a user in a direct conversation');

    const adminUser = await this.participantService.checkParticipantExists(conversationID, admin);

    if (adminUser.role === Role.USER)
      throw new Error('You are not an admin of the conversation');

    if (!adminUser || adminUser.conversation_status !== Status.ACTIVE && adminUser.conversation_status !== Status.MUTED)
      throw new Error('You are not active in this conversation.');

    const userParticipant = await this.participantService.checkParticipantExists(conversationID, user);

    if (userParticipant && (userParticipant.conversation_status === Status.ACTIVE || userParticipant.conversation_status === Status.MUTED))
      throw new Error('User is already a participant of the conversation');

    if (userParticipant && userParticipant.conversation_status === Status.BANNED)
      throw new Error('User is banned from the conversation');

    return true;
  }

  async validateRemoveParticipant(conversationID: string, admin: string, user: string): Promise<boolean> {
    if (admin === user)
      throw new Error('You cannot remove yourself. Use leave instead.');

    const conversation = await this.conversationService.checkConversationExists(conversationID);

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error('You cannot remove a user in a direct conversation');

    const adminUser = await this.participantService.checkParticipantExists(conversationID, admin);

    if (!adminUser)
      throw new Error('Admin is not a participant of the conversation');

    if (adminUser.role === Role.USER)
      throw new Error('You are not an admin of the conversation');

    if (!adminUser || adminUser.conversation_status !== Status.ACTIVE && adminUser.conversation_status !== Status.MUTED)
      throw new Error('You are not active in this conversation.');

    const userParticipant = await this.participantService.checkParticipantExists(conversationID, user);

    if (!userParticipant || userParticipant.conversation_status !== Status.ACTIVE && userParticipant.conversation_status !== Status.MUTED)
      throw new Error('User is not a participant of the conversation');

    if (userParticipant.role === Role.OWNER)
      throw new Error('You cannot remove the owner of the conversation');

    return true;
  }

  async validateBanUser(conversationID: string, admin: string, user: string): Promise<boolean> {
    if (admin === user)
      throw new Error('You cannot ban yourself');

    const conversation = await this.conversationService.checkConversationExists(conversationID);

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error('You cannot ban a user in a direct conversation. Block him instead.');

    const adminUser = await this.participantService.checkParticipantExists(conversationID, admin);

    if (!adminUser)
      throw new Error('Admin is not a participant of the conversation');

    if (adminUser.role === Role.USER)
      throw new Error('You are not an admin of the conversation');

    if (!adminUser || adminUser.conversation_status !== Status.ACTIVE && adminUser.conversation_status !== Status.MUTED)
      throw new Error('You are not active in this conversation.');

    const userParticipant = await this.participantService.checkParticipantExists(conversationID, user);

    if (!userParticipant)
      throw new Error('User is not a participant of the conversation');

    if (userParticipant.conversation_status !== Status.ACTIVE && userParticipant.conversation_status !== Status.MUTED)
      throw new Error('User is not active in this conversation.');

    if (userParticipant.role === Role.OWNER)
      throw new Error('You cannot ban the owner of the conversation');

    return true;
  }

  async validateUnBanUser(conversationID: string, admin: string, user: string): Promise<boolean> {
    if (admin === user)
      throw new Error('You cannot unban yourself');

    const conversation = await this.conversationService.checkConversationExists(conversationID);

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error('You cannot unban a user in a direct conversation');

    const adminUser = await this.participantService.checkParticipantExists(conversationID, admin);

    if (!adminUser)
      throw new Error('Admin is not a participant of the conversation');

    if (adminUser.role === Role.USER)
      throw new Error('You are not an admin of the conversation');

    if (!adminUser || adminUser.conversation_status !== Status.ACTIVE && adminUser.conversation_status !== Status.MUTED)
      throw new Error('You are not active in this conversation.');

    const userParticipant = await this.participantService.checkParticipantExists(conversationID, user);

    if (!userParticipant)
      throw new Error('User is not a participant of the conversation');

    if (userParticipant.conversation_status === Status.ACTIVE)
      throw new Error('User is not banned');

    if (userParticipant.role === Role.OWNER)
      throw new Error('You cannot unban the owner of the conversation');

    return true;
  }

  async validateRemovePassword(conversationID: string, admin: string): Promise<boolean> {
    const conversation = await this.conversationService.checkConversationExists(conversationID)

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.PUBLIC || conversation.privacy === Privacy.DIRECT)
      throw new Error('Conversation is not password protected');

    const adminUser = await this.participantService.checkParticipantExists(conversationID, admin);

    if (!adminUser)
      throw new Error('You are not a participant of this channel');

    if (adminUser.role !== Role.USER)
      throw new Error('You are not an admin of the conversation');

    if (!adminUser || adminUser.conversation_status !== Status.ACTIVE && adminUser.conversation_status !== Status.MUTED)
      throw new Error('You are not active in this conversation.');

    return true;
  }

  async validateMute(conversationID: string, admin: string, user: string): Promise<boolean> {
    if (admin === user)
      throw new Error('You cannot mute yourself');

    const conversation = await this.conversationService.checkConversationExists(conversationID);

    if (!conversation)
      throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT)
      throw new Error('You cannot mute a user in a direct conversation');

    const adminUser = await this.participantService.checkParticipantExists(conversationID, admin);

    if (!adminUser)
      throw new Error('Admin is not a participant of the conversation');

    if (adminUser.role === Role.USER)
      throw new Error('You are not an admin of the conversation');

    if (!adminUser || adminUser.conversation_status !== Status.ACTIVE && adminUser.conversation_status !== Status.MUTED)
      throw new Error('You are not active in this conversation.');

    const userParticipant = await this.participantService.checkParticipantExists(conversationID, user);

    if (!userParticipant)
      throw new Error('User is not a participant of the conversation');

    if (userParticipant.conversation_status === Status.MUTED)
      throw new Error('User is already muted');

    if (userParticipant.conversation_status !== Status.ACTIVE)
      throw new Error('User is not active in this conversation.');

    if (userParticipant.role === Role.OWNER)
      throw new Error('You cannot mute the owner of the conversation');

    return true;
  }
}
