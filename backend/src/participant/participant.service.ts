import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@Injectable()
export class ParticipantService {
  constructor(private prisma: PrismaService) {}

  async create(createParticipantDto: CreateParticipantDto) {
    return await this.prisma.participant.create({
      data: {
        user_id: createParticipantDto.user_id,
        conversation_id: createParticipantDto.conversation_id,
        role: createParticipantDto.role,
        conversation_status: createParticipantDto.conversation_status,
      },
    });
  }

  async findAll() {
    return await this.prisma.participant.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.participant.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateParticipantDto: UpdateParticipantDto) {
    return await this.prisma.participant.update({
      where: {
        id: id,
      },
      data: {
        user_id: updateParticipantDto.user_id,
        conversation_id: updateParticipantDto.conversation_id,
        role: updateParticipantDto.role,
        conversation_status: updateParticipantDto.conversation_status,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.participant.delete({
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
        user_id_conversation_id: {
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

  async getConversations(user_id: string) {
    return await this.prisma.participant.findMany({
      where: {
        user_id: user_id,
      },
    });
  }

  async getConversation(user_id: string, conversation_id: string) {
    return await this.prisma.participant.findUnique({
      where: {
        user_id_conversation_id: {
          user_id: user_id,
          conversation_id: conversation_id,
        },
      },
    });
  }

  async updateConversationStatus(
    user_id: string,
    conversation_id: string,
    conversation_status: string,
  ) {
    return await this.prisma.participant.update({
      where: {
        user_id_conversation_id: {
          user_id: user_id,
          conversation_id: conversation_id,
        },
      },
      data: {
        conversation_status: conversation_status,
      },
    });
  }

  async updateRole(
    user_id: string,
    conversation_id: string,
    role: string,
  ) {
    return await this.prisma.participant.update({
      where: {
        user_id_conversation_id: {
          user_id: user_id,
          conversation_id: conversation_id,
        },
      },
      data: {
        role: role,
      },
    });
  }

  async getConversationStatus(
    user_id: string,
    conversation_id: string,
  ) {
    return await this.prisma.participant.findUnique({
      where: {
        user_id_conversation_id: {
          user_id: user_id,
          conversation_id: conversation_id,
        },
      },
      select: {
        conversation_status: true,
      },
    });
  }

  async getRole(
    user_id: string,
    conversation_id: string,
  ) {
    return await this.prisma.participant.findUnique({
      where: {
        user_id_conversation_id: {
          user_id: user_id,
          conversation_id: conversation_id,
        },
      },
      select: {
        role: true,
      },
    });
  }

  async getConversationId(
    user_id: string,
    conversation_id: string,
  ) {
    return await this.prisma.participant.findUnique({
      where: {
        user_id_conversation_id: {
          user_id: user_id,
          conversation_id: conversation_id,
        },
      },
      select: {
        conversation_id: true,
      },
    });
  }

  async getUserId(
    user_id: string,
    conversation_id: string,
  ) {
    return await this.prisma.participant.findUnique({
      where: {
        user_id_conversation_id: {
          user_id: user_id,
          conversation_id: conversation_id,
        },
      },
      select: {
        user_id: true,
      },
    });
  }

  async getConversationIdByUserId(user_id: string) {
    return await this.prisma.participant.findMany({
      where: {
        user_id: user_id,
      },
      select: {
        conversation_id: true,
      },
    });
  }

  async getUserIdByConversationId(conversation_id: string) {
    return await this.prisma.participant.findMany({
      where: {
        conversation_id: conversation_id,
      },
      select: {
        user_id: true,
      },
    });
  }

  async getConversationStatusByUserId(user_id: string) {
    return await this.prisma.participant.findMany({
      where: {
        user_id: user_id,
      },
      select: {
        conversation_status: true,
      },
    });
  }
}
