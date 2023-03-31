import { Injectable } from '@nestjs/common';
import { Privacy } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async create(createConversationDto: CreateConversationDto) {
    return await this.prisma.conversation.create({
      data: {
        title: createConversationDto.title,
        creator_id: createConversationDto.creator_id,
      },
    });
  }

  async createConversation(createConversation: CreateConversationDto) {
    return await this.prisma.conversation.create({
      data: {
        title: createConversation.title,
        creator_id: createConversation.creator_id,
        password: createConversation.password,
        privacy: 'PRIVATE',
      },
    });
  }

  async getChatsByUserId(userId: string) {
    return await this.prisma.participant.findMany({
      where: {
        user_id: userId,
        conversation: {
          privacy: 'PUBLIC', // Assuming true corresponds to public chats in the original function
        },
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

  async findAll() {
    return await this.prisma.conversation.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.conversation.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateConversationDto: UpdateConversationDto) {
    return await this.prisma.conversation.update({
      where: {
        id: id,
      },
      data: {
        title: updateConversationDto.title,
        creator_id: updateConversationDto.creator_id,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.conversation.delete({
      where: {
        id: id,
      },
    });
  }

  async addParticipant(conversation_id: string, user_id: string) {
    return await this.prisma.participant.create({
      data: {
        user_id: user_id,
        conversation_id: conversation_id,
      },
    });
  }

  async removeParticipant(conversation_id: string, user_id: string) {
    return await this.prisma.participant.delete({
      where: {
        conversation_id_user_id: {
          user_id: user_id,
          conversation_id: conversation_id,
        },
      },
    });
  }

  async getParticipants(conversation_id: string) {
    return await this.prisma.participant.findMany({
      where: {
        conversation_id: conversation_id,
      },
    });
  }

  async getMessages(conversation_id: string) {
    return await this.prisma.message.findMany({
      where: {
        conversation_id: conversation_id,
      },
    });
  }

  async getConversationByUserId(user_id: string) {
    return await this.prisma.participant.findMany({
      where: {
        user_id: user_id,
      },
    });
  }

  async getConversationByCreatorId(creator_id: string) {
    return await this.prisma.conversation.findMany({
      where: {
        creator_id: creator_id,
      },
    });
  }

  async getConversationByTitle(title: string) {
    return await this.prisma.conversation.findMany({
      where: {
        title: title,
      },
    });
  }

  async getConversationByPrivacy(privacy: string) {
    return await this.prisma.conversation.findMany({
      where: {
        privacy: Privacy.PUBLIC
      },
    });
  }

  async getConversationByCreatorIdAndPrivacy(creator_id: string, privacy: string) {
    return await this.prisma.conversation.findMany({
      where: {
        creator_id: creator_id,
        privacy: Privacy.PUBLIC,
      },
    });
  }

  async getConversationByCreatorIdAndTitle(creator_id: string, title: string) {
    return await this.prisma.conversation.findMany({
      where: {
        creator_id: creator_id,
        title: title,
      },
    });
  }

  async getConversationByCreatorIdAndTitleAndPrivacy(creator_id: string, title: string, privacy: string) {
    return await this.prisma.conversation.findMany({
      where: {
        creator_id: creator_id,
        title: title,
        privacy: Privacy.PUBLIC,
      },
    });
  }

  async getConversationByUserIdAndPrivacy(user_id: string, privacy: string) {
    return await this.prisma.participant.findMany({
      where: {
        user_id: user_id,
        conversation: {
          privacy: Privacy.PUBLIC,
        },
      },
    });
  }

  async getConversationByUserIdAndTitle(user_id: string, title: string) {
    return await this.prisma.participant.findMany({
      where: {
        user_id: user_id,
        conversation: {
          title: title,
        },
      },
    });
  }

  async getDirectConversation(user_id: string, creator_id: string) {
    return await this.prisma.conversation.findMany({
      where: {
        creator_id: creator_id,
        privacy: Privacy.DIRECT,
        participants: {
          every: {
            user_id: user_id,
          },
        },
      },
    });
  }
}
