import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Status, Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateParticipantDto, UpdateParticipantDto } from '../dto/participants.dto';
import { ConversationService } from './conversation.service';

@Injectable()
export class ParticipantService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ConversationService))
    private conversationService: ConversationService,
    ) {}

  async addParticipant(
    createParticipant: CreateParticipantDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: createParticipant.user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createParticipant.user_id} not found.`);
    }

    // Check if the conversation exists
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: createParticipant.conversation_id },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${createParticipant.conversation_id} not found.`);
    }

    return await this.prisma.participant.create({
      data: {
        user_id: createParticipant.user_id,
        role: Role[createParticipant.role],
        conversation_status: Status[createParticipant.conversation_status],
        conversation_id: createParticipant.conversation_id,
      },
    });
  }

  async findParticipantByUserIDandConversationID(
    userID: string,
    conversationID: string,
  ) {

    const participant = await this.prisma.participant.findFirst({
      where: {
        user_id: userID,
        conversation_id: conversationID,
      },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found.');
    }

    return participant;
  }

  async addParticipantToConversation(
    createParticipant: CreateParticipantDto,
  ) {
    const conversation = await this.conversationService.checkConversationExists(
      createParticipant.conversation_id,
    );

    if (!conversation) {
      throw new Error('Conversation does not exist');
    }

    const participant = await this.checkParticipantExists(
      createParticipant.conversation_id,
      createParticipant.user_id,
    );

    if (participant) {
      throw new Error('Participant already exists');
    }

    return await this.addParticipant(createParticipant);
  }

  async checkParticipantExists(
    conversationID: string,
    userID: string,
  ) {
    return await this.prisma.participant.findFirst({
      where: {
        conversation_id: conversationID,
        user_id: userID,
      },
    });
  }

  async getParticipantsByConversationID(conversationID: string) {
    return await this.prisma.participant.findMany({
      where: {
        conversation_id: conversationID,
      },
      include: {
        user: true,
      },
    });
  }

  async getConversationByUserId(userId: string) {
    return await this.prisma.participant.findMany({
      where: {
        user_id: userId,
      },
      include: {
        conversation: {
          select: {
            id: true,
            title: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
      orderBy: {
        conversation: {
          updated_at: 'desc',
        },
      },
    });
  }

  async removeParticipantFromConversation(
    conversationID: string,
    userID: string,
  ) {
    const conversation = await this.conversationService.checkConversationExists(
      conversationID,
    );

    if (!conversation) {
      throw new Error('Conversation does not exist');
    }

    const participant = await this.checkParticipantExists(
      conversationID,
      userID,
    );

    if (!participant) {
      throw new Error('Participant does not exist');
    }

    return await this.prisma.participant.update({
      where: {
        id: participant.id,
      },
      data: {
        conversation_status: Status.DELETED,
      },
    });
  }

  async updateParticipantStatus(
    conversationID: string,
    userID: string,
    status: Status,
  ) {
    const conversation = await this.conversationService.checkConversationExists(
      conversationID,
    );

    if (!conversation) {
      throw new Error('Conversation does not exist');
    }

    const participant = await this.checkParticipantExists(
      conversationID,
      userID,
    );

    if (!participant) {
      throw new Error('Participant does not exist');
    }

    return await this.prisma.participant.update({
      where: {
        id: participant.id,
      },
      data: {
        conversation_status: status,
      },
    });
  }

  async updateParticipantRole(
    conversationID: string,
    userID: string,
    role: string
  ) {
    const conversation = await this.conversationService.checkConversationExists(
      conversationID,
    );

    if (!conversation) {
      throw new Error('Conversation does not exist');
    }

    const participant = await this.checkParticipantExists(
      conversationID,
      userID,
    );

    if (!participant) {
      throw new Error('Participant does not exist');
    }

    return await this.prisma.participant.update({
      where: {
        id: participant.id,
      },
      data: {
        role: Role[role],
      },
    });
  }

  async makeParticipantAdmin(
    conversationID: string,
    userID: string,
  ) {
    const conversation = await this.conversationService.checkConversationExists(
      conversationID,
    );
    if (!conversation)
      throw new Error('Conversation does not exist');

    const participant = await this.checkParticipantExists(
      conversationID,
      userID,
    );

    if (!participant || participant.conversation_status === Status.DELETED)
      throw new Error('Participant does not exist');

    if (participant.role === Role.ADMIN)
      throw new Error('Participant is already an admin');

    return await this.updateParticipantRole(conversationID, userID, 'ADMIN');
  }
}