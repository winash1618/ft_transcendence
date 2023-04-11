import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Privacy, Role, Status } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateConversationDto, UpdateConversationDto } from '../dto/conversation.dto';
import * as brypt from 'bcrypt';
import { ParticipantService } from './participant.service';

@Injectable()
export class ConversationService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ParticipantService))
    private participantService: ParticipantService,
    ) {}

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
        creator_id: createConversation.creator_id,
        password: createConversation.password,
        privacy: Privacy[createConversation.privacy],
      },
    });
  }

  async protectConversation(conversationID: string, password: string) {
    const conversation = await this.checkConversationExists(conversationID);

    if (!conversation) {
      throw new Error('Conversation does not exist');
    }

    if (conversation.privacy === 'PROTECTED') {
      throw new Error('Conversation is already protected');
    }

    const hashedPassword = await this.hashPassword(password);

    return await this.prisma.conversation.update({
      where: {
        id: conversationID,
      },
      data: {
        password: hashedPassword,
        privacy: Privacy.PROTECTED,
      },
    });
  }

  // async createDirectConversation(createConversation: CreateConversationDto, userID: string, otherUserID: string) {
  //   if (this.checkDirectConversationExists(userID, otherUserID)) {
  //     throw new Error('Direct conversation already exists');
  //   }

  //   if (userID === otherUserID) {
  //     throw new Error('Cannot create direct conversation with yourself');
  //   }

  //   // Check if other user is blocked or exists

  //   const conversation = await this.prisma.conversation.create({
  //     data: {
  //       privacy: Privacy[createConversation.privacy],
  //     },
  //   });

  //   await this.participantService.addParticipantToConversation({
  //     conversation_id: conversation.id,
  //     user_id: userID,
  //     role: 'OWNER',
  //     conversation_status: 'ACTIVE',
  //   });

  //   await this.participantService.addParticipantToConversation({
  //     conversation_id: conversation.id,
  //     user_id: otherUserID,
  //     role: 'MEMBER',
  //     conversation_status: 'ACTIVE',
  //   });

  //   return conversation;
  // }

  async checkConversationExists(conversationID: string) {
    return await this.prisma.conversation.findUnique({
      where: {
        id: conversationID,
      },
    });
  }

  async checkDirectConversationExists(userID: string, otherUserID: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            user_id: {
              in: [userID, otherUserID],
            },
          },
        },
      },
    });

    console.log(conversation);

    return conversation;
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
              not: Status['BANNED']
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
