import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMessageDto } from '../dto/messages.dto';
import { ConversationService } from './conversation.service';
import { ParticipantService } from './participant.service';
import { Status } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private conversationService: ConversationService,
    private participantService: ParticipantService,
    private usersService: UsersService,
  ) {}

  async createMessage(createMessage: CreateMessageDto, userID: string) {
    const conversation = await this.conversationService.checkConversationExists(
      createMessage.conversation_id,
    );

    if (!conversation) {
      throw new Error('Conversation does not exist');
    }

    // throw error when the other user in direct conversation is blocked
    if (conversation.privacy === 'DIRECT') {
      const otherParticipant = await this.getOtherParticipant(
        createMessage.conversation_id,
        userID,
      );
      if (await this.usersService.isBothUsersBlocked(userID, otherParticipant))
        throw new Error('You are blocked.');
    }

    const participant = await this.participantService.checkParticipantExists(
      createMessage.conversation_id,
      userID,
    );

    if (!participant) throw new Error('Participant is not in the conversation');

    if (
      !participant ||
      (participant.conversation_status !== Status.ACTIVE &&
        participant.conversation_status !== Status.MUTED)
    )
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
                profile_picture: true,
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

  async getOtherParticipant(conversationID: string, userID: string) {
    const id = this.prisma.conversation.findUnique({
      where: {
        id: conversationID,
      },
      select: {
        participants: {
          where: {
            user_id: {
              not: userID,
            },
          },
          select: {
            user: {
              select: {
                id: true,
                username: true,
                profile_picture: true,
              },
            },
          },
        },
      },
    });

    return id.then((res) => res.participants[0].user.id);
  }

  async getDisplayMessagesByConversationID(conversationID: string, userID: string) {
    if (!this.conversationService.checkConversationExists(conversationID)) {
      throw new Error('Conversation does not exist');
    }

    if (!(await this.participantService.checkParticipantExists(conversationID, userID))) {
      throw new Error('Participant is not in the conversation');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userID },
      select: {
        blocked_users: { select: { id: true } },
        blocked_by: { select: { id: true } },
      },
    });

    const blockedUsersIDs = [
      ...user.blocked_users.map((blockedUser) => blockedUser.id),
      ...user.blocked_by.map((blockedByUser) => blockedByUser.id),
    ];

    const messages = await this.prisma.message.findMany({
      where: {
        conversation_id: conversationID,
        author: {
          user_id: {
            notIn: blockedUsersIDs,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 150,
      select: {
        author: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                profile_picture: true,
              },
            },
          },
        },
        id: true,
        message: true,
        conversation_id: true,
      },
    });

    return messages.reverse();
  }
}
