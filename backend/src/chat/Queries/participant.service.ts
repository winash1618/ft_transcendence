import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Status, Role } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateParticipantDto } from '../dto/participants.dto';
import { ConversationService } from './conversation.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ParticipantService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ConversationService))
    private conversationService: ConversationService,
    private userService: UsersService,
  ) {}

  async addParticipant(createParticipant: CreateParticipantDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createParticipant.user_id },
    });

    if (!user) {
      throw new Error(`User with ID ${createParticipant.user_id} not found.`);
    }

    // Check if the conversation exists
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: createParticipant.conversation_id },
    });

    if (!conversation) {
      throw new Error(
        `Conversation with ID ${createParticipant.conversation_id} not found.`,
      );
    }

    return await this.prisma.participant.create({
      data: {
        user_id: createParticipant.user_id,
        role: Role[createParticipant.role],
        conversation_status: Status[createParticipant.conversation_status],
        conversation_id: createParticipant.conversation_id,
      },
    });
  }

  async findParticipantByUserIDandConversationID(
    userID: string,
    conversationID: string,
  ) {
    const participant = await this.prisma.participant.findFirst({
      where: {
        user_id: userID,
        conversation_id: conversationID,
      },
    });

    if (!participant) {
      throw new Error('Participant not found.');
    }

    return participant;
  }

  async addParticipantToConversation(
    createParticipant: CreateParticipantDto,
    password?: string,
  ) {
    try {
      const conversation =
        await this.conversationService.checkConversationExists(
          createParticipant.conversation_id,
        );

      if (!conversation) {
        throw new Error('Conversation does not exist');
      }

      if (password) {
        if (conversation.privacy !== 'PUBLIC') {
          if (password === '' || password === null || password === undefined)
            throw new Error('Password is required');
          if (
            (await this.conversationService.validatePassword(
              password,
              conversation.password,
            )) === false
          )
            throw new Error('Invalid password');
        }
      }

      const participant = await this.checkParticipantExists(
        createParticipant.conversation_id,
        createParticipant.user_id,
      );

      if (participant) {
        if (participant.conversation_status === 'BANNED')
          throw new Error('User is banned');

        if (
          participant.conversation_status === 'ACTIVE' ||
          participant.conversation_status === 'MUTED'
        )
          throw new Error('User is already in the conversation');

        return await this.updateParticipantStatus(
          createParticipant.conversation_id,
          createParticipant.user_id,
          'ACTIVE',
        );
      }

      return await this.addParticipant(createParticipant);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async checkParticipantExists(conversationID: string, userID: string) {
    return await this.prisma.participant.findFirst({
      where: {
        conversation_id: conversationID,
        user_id: userID,
      },
    });
  }

  async getParticipantsByConversationID(conversationID: string) {
    return await this.prisma.participant.findMany({
      where: {
        conversation_id: conversationID,
      },
      include: {
        user: true,
      },
    });
  }

  async getParticipants(conversationID: string) {
    if (!this.conversationService.checkConversationExists(conversationID)) {
      throw new Error('Conversation does not exist');
    }

    return await this.prisma.participant.findMany({
      where: {
        conversation_id: conversationID,
      },
      select: {
        user: {
          select: {
            username: true,
            id: true,
          },
        },
        role: true,
        conversation_status: true,
      },
    });
  }

  async getConversationMembers(conversationID: string, userID: string) {
    if (!(await this.conversationService.checkConversationExists(conversationID))) {
      throw new Error('Conversation does not exist');
    }

    const participant = await this.checkParticipantExists(
      conversationID,
      userID,
    );

    if (!participant)
      throw new Error('User is not in the conversation');

    return await this.prisma.participant.findMany({
      where: {
        conversation_id: conversationID,
        conversation_status: {
          in: ['ACTIVE', 'MUTED'],
        }
      },
      select: {
        user: {
          select: {
            username: true,
            id: true,
            profile_picture: true,
          },
        },
        role: true,
        conversation_status: true,
      },
    });
  }

  async isUserAdminInConversation(userID: string, conversationID: string) {
    const participant = await this.prisma.participant.findFirst({
      where: {
        user_id: userID,
        conversation_id: conversationID,
        role: {
          in: [Role.OWNER, Role.ADMIN],
        },
      },
    });

    return participant !== null;
  }

  async getConversationByUserId(userId: string) {
    return await this.prisma.participant.findMany({
      where: {
        user_id: userId,
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

  async removeParticipantFromConversation(
    conversationID: string,
    userID: string,
  ) {
    await this.updateParticipantRole(conversationID, userID, 'USER');
    return await this.updateParticipantStatus(
      conversationID,
      userID,
      'DELETED',
    );
  }

  async updateParticipantStatus(
    conversationID: string,
    userID: string,
    status: Status,
  ) {
    const participant = await this.checkParticipantExists(
      conversationID,
      userID,
    );

    if (!participant) {
      throw new Error('Participant does not exist');
    }

    return await this.prisma.participant.update({
      where: {
        id: participant.id,
      },
      data: {
        conversation_status: status,
      },
      select: {
        id: true,
        user_id: true,
        conversation_id: true,
        conversation_status: true,
        role: true,
      },
    });
  }

  async updateParticipantRole(
    conversationID: string,
    userID: string,
    role: string,
  ) {
    const conversation = await this.conversationService.checkConversationExists(
      conversationID,
    );

    if (!conversation) {
      throw new Error('Conversation does not exist');
    }

    const participant = await this.checkParticipantExists(
      conversationID,
      userID,
    );

    if (!participant) {
      throw new Error('Participant does not exist');
    }

    return await this.prisma.participant.update({
      where: {
        id: participant.id,
      },
      data: {
        role: Role[role],
      },
    });
  }

  async makeParticipantAdmin(
    conversationID: string,
    userID: string,
    adminUser: string,
  ) {
    if (
      conversationID === undefined ||
      userID === undefined ||
      adminUser === undefined
    )
      throw new Error('Missing parameters');

    const conversation = await this.conversationService.checkConversationExists(
      conversationID,
    );

    if (!conversation) throw new Error('Conversation does not exist');

    if (conversation.privacy === 'DIRECT')
      throw new Error('Admin does not exist in direct conversations');

    const participant = await this.checkParticipantExists(
      conversationID,
      userID,
    );

    const admin = await this.checkParticipantExists(conversationID, adminUser);

    if (!admin || admin.conversation_status === Status.DELETED)
      throw new Error('User does not exist.');

    if (admin.role !== Role.OWNER) throw new Error('User is not an owner.');

    if (!participant || participant.conversation_status === Status.DELETED)
      throw new Error('Participant does not exist');

    if (
      (await this.isUserAdminInConversation(adminUser, conversationID)) ===
      false
    )
      throw new Error('User is not an admin');

    if (participant.role === Role.ADMIN)
      throw new Error('Participant is already an admin');

    return await this.updateParticipantRole(conversationID, userID, 'ADMIN');
  }

  async banUserFromConversation(
    conversationID: string,
    userID: string,
  ) {
    return await this.updateParticipantStatus(
      conversationID,
      userID,
      Status.BANNED,
    );
  }

  async unbanUserFromConversation(
    conversationID: string,
    userID: string,
    adminUser: string,
  ) {
    if (
      !(await this.conversationService.checkConversationExists(conversationID))
    )
      throw new Error('Conversation does not exist');

    if (
      (await this.isUserAdminInConversation(conversationID, adminUser)) ===
      false
    )
      throw new Error('User is not an admin');

    const participant = await this.checkParticipantExists(
      conversationID,
      userID,
    );

    if (!participant || participant.conversation_status === Status.DELETED)
      throw new Error('Participant does not exist');

    if (participant.conversation_status === Status.ACTIVE)
      throw new Error('Participant is not banned');

    return await this.updateParticipantStatus(
      conversationID,
      userID,
      Status.ACTIVE,
    );
  }

  async kickUserFromConversation(
    conversationID: string,
    userID: string,
    adminUser: string,
  ) {
    if (
      !(await this.conversationService.checkConversationExists(conversationID))
    )
      throw new Error('Conversation does not exist');

    if (
      (await this.isUserAdminInConversation(conversationID, adminUser)) ===
      false
    )
      throw new Error('User is not an admin');

    const participant = await this.checkParticipantExists(
      conversationID,
      userID,
    );

    if (!participant || participant.conversation_status === Status.DELETED)
      throw new Error('Participant does not exist');

    if (participant.role === Role.OWNER) throw new Error('Cannot kick owner');

    if (participant.role === Role.ADMIN) throw new Error('Cannot kick admin');

    if (participant.conversation_status === Status.KICKED)
      throw new Error('Participant is already kicked');

    if (participant.conversation_status === Status.BANNED)
      throw new Error('Participant is already banned');

    return await this.updateParticipantStatus(
      conversationID,
      userID,
      Status.KICKED,
    );
  }

  async validationCheck(
    conversationID: string,
    userID?: string,
    adminUser?: string,
  ) {
    const conversation = await this.conversationService.checkConversationExists(
      conversationID,
    );

    if (!conversation) {
      throw new Error('Conversation does not exist');
    }

    if (userID) {
      const participant = await this.checkParticipantExists(
        conversationID,
        userID,
      );

      if (!participant) {
        throw new Error('Participant does not exist');
      }

      if (participant.conversation_status === Status.DELETED) {
        throw new Error('Participant has been removed from conversation');
      }

      if (participant.conversation_status === Status.BANNED) {
        throw new Error('Participant has been banned from conversation');
      }

      if (participant.conversation_status === Status.KICKED) {
        throw new Error('Participant has been kicked from conversation');
      }
    }

    if (adminUser) {
      const isAdmin = await this.isUserAdminInConversation(
        adminUser,
        conversationID,
      );
      if (isAdmin === false) throw new Error('User is not an admin');
    }

    return true;
  }

  async bannedUsers(conversationID: string, userID: string) {
    const conversation = await this.conversationService.checkConversationExists(
      conversationID,
    );

    if (!conversation) {
      throw new Error('Conversation does not exist');
    }

    if (!(await this.checkParticipantExists(conversationID, userID)))
      throw new Error('Participant does not exist');

    return this.prisma.participant.findMany({
      where: {
        conversation_id: conversationID,
        conversation_status: Status['BANNED'],
      },
      select: {
        role: true,
        user: {
          select: {
            id: true,
            username: true,
            profile_picture: true,
          },
        },
      },
    });
  }

  async checkActiveOrMutedMembers(conversationId: string, userIdToExclude: string) {
    const participants = await this.prisma.participant.findMany({
      where: {
        conversation_id: conversationId,
        user_id: {
          not: userIdToExclude,
        },
        OR: [
          {
            conversation_status: 'ACTIVE',
          },
          {
            conversation_status: 'MUTED',
          },
        ],
      },
      select: {
        user: {
          select: {
            username: true,
          },
        },
        conversation_status: true,
      },
    });

    if (!participants || participants.length === 0) {
      return false;
    }

    return participants;
  }
}
