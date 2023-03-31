import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateMessageDto, UpdateMessageDto } from '../dto/messages.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    return await this.prisma.message.create({
      data: {
        message: createMessageDto.message,
        author_id: createMessageDto.author_id,
        conversation_id: createMessageDto.conversation_id,
        },
      });
  }

  async findAll() {
    return await this.prisma.message.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.message.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    return await this.prisma.message.update({
      where: {
        id: id,
      },
      data: {
        message: updateMessageDto.message,
        author_id: updateMessageDto.author_id,
        conversation_id: updateMessageDto.conversation_id,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.message.delete({
      where: {
        id: id,
      },
    });
  }

  async getConversation(conversation_id: string) {
    return await this.prisma.message.findMany({
      where: {
        conversation_id: conversation_id,
      },
    });
  }

  async addMessage(conversation_id: string, author_id: string, message: string) {
    return await this.prisma.message.create({
      data: {
        message: message,
        author_id: author_id,
        conversation_id: conversation_id,
      },
    });
  }

  async deleteMessage(id: string) {
    return await this.prisma.message.delete({
      where: {
        id: id,
      },
    });
  }

  async updateMessage(id: string, message: string) {
    return await this.prisma.message.update({
      where: {
        id: id,
      },
      data: {
        message: message,
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

  async getMessagesByUser(user_id: string) {
    return await this.prisma.message.findMany({
      where: {
        author_id: user_id,
      },
    });
  }

  async getMessagesByConversation(conversation_id: string) {
    return await this.prisma.message.findMany({
      where: {
        conversation_id: conversation_id,
      },
    });
  }

  async getMessagesByUserAndConversation(
    user_id: string,
    conversation_id: string,
  ) {
    return await this.prisma.message.findMany({
      where: {
        author_id: user_id,
        conversation_id: conversation_id,
      },
    });
  }

  async getMessagesByUserAndConversationAndMessage(
    user_id: string,
    conversation_id: string,
    message: string,
  ) {
    return await this.prisma.message.findMany({
      where: {
        author_id: user_id,
        conversation_id: conversation_id,
        message: message,
      },
    });
  }

  async getMessagesByUserAndConversationAndMessageAndId(
    user_id: string,
    conversation_id: string,
    message: string,
    id: string,
  ) {
    return await this.prisma.message.findMany({
      where: {
        author_id: user_id,
        conversation_id: conversation_id,
        message: message,
        id: id,
      },
    });
  }
}
