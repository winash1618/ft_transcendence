import { Injectable } from '@nestjs/common';
import { Privacy, Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateConversationDto, UpdateConversationDto } from '../dto/conversation.dto';
import * as brypt from 'bcrypt';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  private async hashPassword(password: string) {
    return await brypt.hash(password, 10);
  }

  private async validatePassword(password: string, hash: string) {
    return await brypt.compare(password, hash);
  }

  async createConversation(createConversation: CreateConversationDto) {
    if (createConversation.privacy === 'PRIVATE' &&
      (createConversation.password === '' || createConversation.password === undefined)
    ) {
      throw new Error('Password is required for private conversation');
    }

    if (createConversation.privacy === 'PROTECTED') {
      createConversation.password = await this.hashPassword(createConversation.password);
    }


    return await this.prisma.conversation.create({
      data: {
        title: createConversation.title,
        password: createConversation.password,
        privacy: Privacy[createConversation.privacy],
      },
    });
  }


  async checkConversationExists(conversationID: string) {
    return await this.prisma.conversation.findUnique({
      where: {
        id: conversationID,
      },
    });
  }

  async getConversationByID(conversationID: string) {
    return await this.prisma.conversation.findUnique({
      where: {
        id: conversationID,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  // async checkConversationTitleExists(title: string) {
  //   return this.prisma.conversation.findUnique({
  //     where: {
  //       title,
  //     },
  //   });
  // }

  async getConversationByUserID(userID: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            user_id: userID,
            conversation_status: {
              not: 'BLOCKED',
            }
          },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        }
      },
    });
  }
}
