import { Injectable } from '@nestjs/common';
import { Status, Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateParticipantDto, UpdateParticipantDto } from '../dto/participants.dto';

@Injectable()
export class ParticipantService {
  constructor(private prisma: PrismaService) {}

  async create(createParticipantDto: CreateParticipantDto) {
    return await this.prisma.participant.create({
      data: {
        user_id: createParticipantDto.user_id,
        conversation_id: createParticipantDto.conversation_id,
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

  async addParticipant(conversationID: string, userID: string) {
    return await this.prisma.participant.create({
      data: {
        user_id: userID,
        conversation_id: conversationID,
      },
    });
  }

  async getParticipants(conversationID: string) {
    return await this.prisma.participant.findMany({
      where: {
        conversation_id: conversationID,
      },
    });
  }

  async getConversations(userID: string) {
    return await this.prisma.participant.findMany({
      where: {
        user_id: userID,
      },
    });
  }

  async getUserIdByConversationId(conversationID: string) {
    return await this.prisma.participant.findMany({
      where: {
        conversation_id: conversationID,
      },
      select: {
        user_id: true,
      },
    });
  }

  async getConversationStatusByUserId(userID: string) {
    return await this.prisma.participant.findMany({
      where: {
        user_id: userID,
      },
      select: {
        conversation_status: true,
      },
    });
  }
}
