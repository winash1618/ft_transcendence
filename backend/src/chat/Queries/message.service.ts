import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMessageDto, UpdateMessageDto } from '../dto/messages.dto';
import { ConversationService } from './conversation.service';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private conversationService: ConversationService,
  ) {}

  async createMessage(createMessage: CreateMessageDto) {
    const conversation = await this.conversationService.checkConversationExists(
      createMessage.conversation_id,
    );

    if (!conversation) {
      throw new NotFoundException('Conversation does not exist');
    }

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
      throw new NotFoundException('Conversation does not exist');
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
