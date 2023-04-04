import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateMessageDto, UpdateMessageDto } from '../dto/messages.dto';
import { ConversationService } from './conversation.service';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private conversationService: ConversationService,
    ) {}

  async createMessage(createMessage: CreateMessageDto) {
    const conversation = await this.conversationService.checkConversationExists(createMessage.conversation_id);

    console.log(conversation);

    if (!conversation) {
      throw new Error('Conversation does not exist');
    }

    return await this.prisma.message.create({
      data: {
        message: createMessage.message,
        author_id: createMessage.author_id,
        conversation_id: createMessage.conversation_id,
      },
      include: {
        author: {
          include: {
            user: true,
          },
        },
        conversation: true,
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
}
