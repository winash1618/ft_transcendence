import { Injectable } from '@nestjs/common';
import { Status, Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateParticipantDto, UpdateParticipantDto } from '../dto/participants.dto';
import { ConversationService } from './conversation.service';

@Injectable()
export class ParticipantService {
  constructor(
    private prisma: PrismaService,
    private conversationService: ConversationService,
    ) {}

  async addParticipant(
    createParticipant: CreateParticipantDto,
  ) {
    return await this.prisma.participant.create({
      data: {
        user_id: createParticipant.user_id,
        conversation_id: createParticipant.conversation_id,
        role: Role[createParticipant.role],
        conversation_status: Status[createParticipant.conversation_status],
      },
    });
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
}
