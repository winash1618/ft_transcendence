import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Status, Role } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateParticipantDto,
  UpdateParticipantDto,
} from '../dto/participants.dto';
import { ConversationService } from './conversation.service';

@Injectable()
export class ParticipantService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ConversationService))
    private conversationService: ConversationService,
  ) {}

  async addParticipant(createParticipant: CreateParticipantDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createParticipant.user_id },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createParticipant.user_id} not found.`,
      );
    }

    // Check if the conversation exists
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: createParticipant.conversation_id },
    });

    if (!conversation) {
      throw new NotFoundException(
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
      throw new NotFoundException('Participant not found.');
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
        throw new NotFoundException('Conversation does not exist');
      }

      if (
        conversation.privacy === 'PROTECTED' &&
        !this.conversationService.validatePassword(
          password,
          conversation.password,
        )
      ) {
        throw new NotFoundException('Incorrect password');
      }

      const participant = await this.checkParticipantExists(
        createParticipant.conversation_id,
        createParticipant.user_id,
      );

      if (participant) {
        return await this.updateParticipantStatus(
          createParticipant.conversation_id,
          createParticipant.user_id,
          'ACTIVE',
        );
      }

      return await this.addParticipant(createParticipant);
    } catch (error) {
      throw new NotFoundException(error.message);
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
      throw new NotFoundException('Conversation does not exist');
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

  async getConversationMembers(conversationID: string) {
    if (!this.conversationService.checkConversationExists(conversationID)) {
      throw new NotFoundException('Conversation does not exist');
    }

    return await this.prisma.participant.findMany({
      where: {
        conversation_id: conversationID,
        conversation_status: Status.ACTIVE,
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
    const conversation = await this.conversationService.checkConversationExists(
      conversationID,
    );

    if (!conversation) {
      throw new NotFoundException('Conversation does not exist');
    }

    const participant = await this.checkParticipantExists(
      conversationID,
      userID,
    );

    if (!participant) {
      throw new NotFoundException('Participant does not exist');
    }

    return await this.prisma.participant.update({
      where: {
        id: participant.id,
      },
      data: {
        conversation_status: Status.DELETED,
        role: Role.USER,
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
      throw new NotFoundException('Participant does not exist');
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
      throw new NotFoundException('Conversation does not exist');
    }

    const participant = await this.checkParticipantExists(
      conversationID,
      userID,
    );

    if (!participant) {
      throw new NotFoundException('Participant does not exist');
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

  async makeParticipantAdmin(conversationID: string, userID: string, adminUser: string) {
    const conversation = await this.conversationService.checkConversationExists(
      conversationID,
    );
    if (!conversation)
      throw new NotFoundException('Conversation does not exist');

    const participant = await this.checkParticipantExists(
      conversationID,
      userID,
    );

    if (await this.isUserAdminInConversation(adminUser, conversationID) === false)
      throw new NotFoundException('User is not an admin');

    if (!participant || participant.conversation_status === Status.DELETED)
      throw new NotFoundException('Participant does not exist');

    if (participant.role === Role.ADMIN)
      throw new NotFoundException('Participant is already an admin');

    return await this.updateParticipantRole(conversationID, userID, 'ADMIN');
  }

  async banUserFromConversation(
    conversationID: string,
    userID: string,
    adminUser: string,
  ) {
    if (!this.validationCheck(conversationID, userID, adminUser))
      throw new NotFoundException('Validation check failed');

    const participant = await this.checkParticipantExists(
      conversationID,
      userID,
    );

    if (!participant || participant.conversation_status === Status.DELETED)
      throw new NotFoundException('Participant does not exist');

    if (participant.role === Role.OWNER)
      throw new NotFoundException('Cannot ban owner');

    if (participant.role === Role.ADMIN)
      throw new NotFoundException('Cannot ban admin');

    if (participant.conversation_status === Status.BANNED)
      throw new NotFoundException('Participant is already banned');

    if (participant.conversation_status === Status.KICKED)
      throw new NotFoundException('Participant is already kicked');

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
    // if (this.validationCheck(conversationID, userID))
    //   throw new NotFoundException('Validation check failed');

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
    // if (this.validationCheck(conversationID, userID))
    //   throw new NotFoundException('Validation check failed');

    if (await this.isUserAdminInConversation(conversationID, adminUser) === false)
      throw new NotFoundException('User is not an admin');

    return await this.updateParticipantStatus(conversationID, userID, Status.KICKED);
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
      throw new NotFoundException('Conversation does not exist');
    }

    if (userID) {
      const participant = await this.checkParticipantExists(
        conversationID,
        userID,
      );

      if (!participant) {
        throw new NotFoundException('Participant does not exist');
      }

      if (participant.conversation_status === Status.DELETED) {
        throw new NotFoundException(
          'Participant has been removed from conversation',
        );
      }

      if (participant.conversation_status === Status.BANNED) {
        throw new NotFoundException(
          'Participant has been banned from conversation',
        );
      }

      if (participant.conversation_status === Status.KICKED) {
        throw new NotFoundException(
          'Participant has been kicked from conversation',
        );
      }
    }

    if (adminUser) {
      const isAdmin = await this.isUserAdminInConversation(
        adminUser,
        conversationID,
      );
      if (!isAdmin) throw new NotFoundException('User is not an admin');
    }

    return true;
  }

  async bannedUsers(conversationID: string) {
    const conversation = await this.conversationService.checkConversationExists(
      conversationID,
    );

    if (!conversation) {
      throw new NotFoundException('Conversation does not exist');
    }

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
          },
        },
      },
    });
  }
}
