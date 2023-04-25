import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMessageDto, UpdateMessageDto } from '../dto/messages.dto';
import { ConversationService } from './conversation.service';
import { ParticipantService } from './participant.service';
import { Status } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private conversationService: ConversationService,
    private participantService: ParticipantService,
  ) {}

  async createMessage(createMessage: CreateMessageDto) {
    const conversation = await this.conversationService.checkConversationExists(
      createMessage.conversation_id,
    );

    if (!conversation) {
      throw new Error('Conversation does not exist');
    }

    const participant = await this.participantService.checkParticipantExists(
      createMessage.conversation_id,
      createMessage.author_id,
    );

    if (!participant)
      throw new Error('Participant is not in the conversation');

    if (participant.conversation_status !== Status.ACTIVE)
      throw new Error('Participant is not active in the conversation');

    return await this.prisma.message.create({
      data: {
        message: createMessage.message,
        author_id: createMessage.author_id,
        conversation_id: createMessage.conversation_id,
      },
      select: {
        author: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        id: true,
        message: true,
        conversation_id: true,
      },
    });
  }

  async getMessagesByConversationID(conversationID: string) {
    return this.prisma.message.findMany({
      where: {
        conversation_id: conversationID,
      },
      include: {
        author: true,
      },
    });
  }

  async getDisplayMessagesByConversationID(conversationID: string) {
    if (!this.conversationService.checkConversationExists(conversationID)) {
      throw new Error('Conversation does not exist');
    }

    return this.prisma.message.findMany({
      where: {
        conversation_id: conversationID,
      },
      orderBy: {
        created_at: 'asc',
      },
      select: {
        author: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        id: true,
        message: true,
        conversation_id: true,
      },
    });
  }
}
