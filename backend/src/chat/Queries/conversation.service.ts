import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Privacy, Role, Status } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateConversationDto,
  UpdateConversationDto,
} from '../dto/conversation.dto';
import * as brypt from 'bcrypt';
import { ParticipantService } from './participant.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ConversationService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ParticipantService))
    private participantService: ParticipantService,
    private userService: UsersService,
  ) {}

  private async hashPassword(password: string) {
    return await brypt.hash(password, 10);
  }

  async validatePassword(password: string, hash: string) {
    return await brypt.compare(password, hash);
  }

  async createConversation(createConversation: CreateConversationDto) {
    try {
      if (createConversation.password) {
        createConversation.password = await this.hashPassword(
          createConversation.password,
        );
      }

      const conversation = await this.prisma.conversation.create({
        data: {
          title: createConversation.title,
          creator_id: createConversation.creator_id,
          password: createConversation.password,
          privacy: Privacy[createConversation.privacy],
        },
        select: {
          id: true,
          title: true,
          privacy: true,
          creator_id: true,
        },
      });

      return conversation;
    } catch (e) {
      throw new Error(e);
    }
  }

  async protectConversation(
    conversationID: string,
    password: string,
    admin: string,
  ) {
    const conversation = await this.checkConversationExists(conversationID);

    if (!conversation) throw new Error('Conversation does not exist');

    if (conversation.privacy === Privacy.DIRECT) {
      throw new Error('Cannot protect direct conversation');
    }

    if (conversation.privacy === Privacy.PROTECTED) {
      throw new Error('Conversation is already protected');
    }

    const participant = await this.participantService.checkParticipantExists(
      conversationID,
      admin,
    );

    if (!participant)
      throw new Error('User is not a participant of this conversation');

    if (participant.role !== Role.OWNER) throw new Error('User is not OWNER.');

      if (!participant || (participant.conversation_status !== Status.ACTIVE && participant.conversation_status !== Status.MUTED))
      throw new Error('User is not active in this conversation');

    if (password == '' || password == null || password == undefined)
      throw new Error('Password is required');

    const regex = new RegExp(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
    );
    if (!regex.test(password)) throw new Error('Password is invalid');

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

  async removePasswordFromConversation(conversationID: string) {
    return await this.prisma.conversation.update({
      where: {
        id: conversationID,
      },
      data: {
        password: null,
        privacy: Privacy.PUBLIC,
      },
    });
  }

  async createDirectConversation(
    createConversation: CreateConversationDto,
    userID: string,
    otherUserID: string,
  ) {
    const conversation = await this.createConversation(createConversation);

    await this.participantService.addParticipantToConversation({
      conversation_id: conversation.id,
      user_id: userID,
      role: Role['OWNER'],
      conversation_status: 'ACTIVE',
    });

    await this.participantService.addParticipantToConversation({
      conversation_id: conversation.id,
      user_id: otherUserID,
      role: Role['OWNER'],
      conversation_status: 'ACTIVE',
    });

    return conversation;
  }

  async muteUser(
    conversationID: string,
    userID: string,
    muteDuration: number,
    admin: string,
  ) {
    if (!(await this.checkConversationExists(conversationID))) {
      throw new Error('Conversation does not exist');
    }

    const participant = await this.participantService.checkParticipantExists(
      conversationID,
      admin,
    );

    if (!participant) throw new Error('User is not participant');

    if (participant.role === Role['USER']) throw new Error('User is not admin');

    const user = await this.participantService.checkParticipantExists(
      conversationID,
      userID,
    );

    if (!user) throw new Error('User is not participant');

    if (user.role === Role['ADMIN'] || user.role === Role['OWNER'])
      throw new Error('Cannot mute admin');

    if (user.conversation_status === Status.MUTED)
      throw new Error('User is already muted');

    const muteExpiresAt = new Date();
    muteExpiresAt.setMinutes(muteExpiresAt.getMinutes() + muteDuration);

    return await this.prisma.participant.update({
      where: {
        conversation_id_user_id: {
          conversation_id: conversationID,
          user_id: userID,
        },
      },
      data: {
        conversation_status: Status.MUTED,
        mute_expires_at: muteExpiresAt,
      },
    });
  }

  async unmuteUser(conversationID: string, userID: string) {
    if (!(await this.checkConversationExists(conversationID))) {
      throw new Error('Conversation does not exist');
    }

    const user = await this.participantService.checkParticipantExists(
      conversationID,
      userID,
    );

    if (!user) throw new Error('User is not participant');

    if (user.conversation_status === Status.ACTIVE)
      throw new Error('User is not muted');

    return await this.prisma.participant.update({
      where: {
        conversation_id_user_id: {
          conversation_id: conversationID,
          user_id: userID,
        },
      },
      data: {
        conversation_status: Status.ACTIVE,
        mute_expires_at: null,
      },
    });
  }

  async getDirectConversations(userID: string) {
    if (!(await this.userService.checkIfUserExists(userID))) {
      throw new Error('User does not exist');
    }

    return await this.prisma.conversation.findMany({
      where: {
        privacy: Privacy.DIRECT,
        participants: {
          some: {
            user_id: userID,
          },
        },
      },
      orderBy: {
        updated_at: 'desc',
      },
      select: {
        id: true,
        title: true,
        privacy: true,
        participants: {
          select: {
            user: {
              select: {
                username: true,
                profile_picture: true,
              },
            },
          },
          where: {
            user_id: {
              not: userID,
            },
          },
        },
      },
    });
  }

  async getChannels(userID: string) {
    if (!this.userService.checkIfUserExists(userID)) {
      throw new Error('User does not exist');
    }

    return await this.prisma.conversation.findMany({
      where: {
        privacy: {
          in: [Privacy.PUBLIC, Privacy.PRIVATE, Privacy.PROTECTED],
        },
        participants: {
          some: {
            user_id: userID,
            conversation_status: {
              notIn: [Status.BANNED, Status.KICKED, Status.DELETED],
            },
          },
        },
      },
      orderBy: {
        updated_at: 'desc',
      },
      select: {
        id: true,
        title: true,
        privacy: true,
        participants: {
          select: {
            role: true,
            conversation_status: true,
          },
          where: {
            user_id: userID,
          },
        },
      },
    });
  }

  async findChannelsThatUserIsNotIn(userID: string) {
    if (!this.userService.checkIfUserExists(userID)) {
      throw new Error('User does not exist');
    }

    return await this.prisma.conversation.findMany({
      where: {
        privacy: {
          in: [Privacy.PUBLIC, Privacy.PROTECTED],
        },
        OR: [
          {
            participants: {
              every: {
                user_id: {
                  not: userID,
                },
              },
            },
          },
          {
            participants: {
              some: {
                AND: [
                  { user_id: userID },
                  {
                    conversation_status: {
                      notIn: ['ACTIVE', 'MUTED', 'BANNED'],
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      orderBy: {
        updated_at: 'desc',
      },
      select: {
        id: true,
        title: true,
        privacy: true,
      },
    });
  }

  async friendsNotInConversation(userID: string, conversationID: string) {
    if (!this.userService.checkIfUserExists(userID)) {
      throw new Error('User does not exist');
    }

    if (!this.checkConversationExists(conversationID)) {
      throw new Error('Conversation does not exist');
    }

    if (
      !this.participantService.isUserAdminInConversation(userID, conversationID)
    ) {
      throw new Error('User is not admin of the conversation');
    }

    return await this.prisma.user.findUnique({
      where: {
        id: userID,
      },
      select: {
        friends: {
          where: {
            NOT: {
              participant_in: {
                some: {
                  conversation_id: conversationID,
                },
              },
            },
          },
          select: {
            id: true,
            username: true,
            profile_picture: true,
          },
        },
      },
    });
  }

  async checkConversationExists(conversationID: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationID,
      },
    });

    if (!conversation) {
      throw new Error('Conversation does not exist');
    }

    return conversation;
  }

  async checkDirectConversationExists(userID: string, otherUserID: string) {
    if (userID === 'undefined' || otherUserID === 'undefined')
      throw new Error('User does not exist');

    if (!(await this.userService.checkIfUserExists(otherUserID))) {
      throw new Error('User does not exist');
    }

    if (!(await this.userService.checkIfUserExists(userID))) {
      throw new Error('User does not exist');
    }

    if (userID === otherUserID) {
      throw new Error('Cannot create direct conversation with yourself');
    }

    if (await this.userService.isUserBlocked(userID, otherUserID)) {
      throw new Error('User is blocked');
    }

    if (await this.userService.isUserBlocked(otherUserID, userID)) {
      throw new Error('User is blocked');
    }

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        privacy: 'DIRECT',
        AND: [
          {
            participants: {
              some: {
                user_id: userID,
              },
            },
          },
          {
            participants: {
              some: {
                user_id: otherUserID,
              },
            },
          },
        ],
      },
    });

    if (conversation) {
      throw new Error('Conversation already exists.');
    }

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
        messages: true,
      },
    });
  }

  async getConversationByUserID(userID: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            user_id: userID,
            conversation_status: {
              not: Status['BANNED'],
            },
          },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
            messages: true,
          },
        },
      },
    });
  }

  async promoteOldestUserToAdmin(conversationID: string) {
    // Check if there is an admin in the conversation
    const admin = await this.prisma.participant.findFirst({
      where: {
        conversation_id: conversationID,
        role: {
          in: [Role.OWNER, Role.ADMIN],
        },
        conversation_status: {
          notIn: [Status.BANNED, Status.KICKED, Status.DELETED],
        },
      },
    });

    console.log(admin);

    if (!admin) {
      const oldestUser = await this.prisma.participant.findFirst({
        where: {
          conversation_id: conversationID,
          conversation_status: Status['ACTIVE'],
        },
        orderBy: {
          created_at: 'asc',
        },
      });

      if (oldestUser) {
        return await this.prisma.participant.update({
          where: {
            id: oldestUser.id,
          },
          data: {
            role: Role.ADMIN,
          },
          select: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        });
      } else {
        return;
      }
    } else {
      return;
    }
  }

  async validateChannelTitle(title: string) {
    const conversation = await this.prisma.conversation.findMany({
      where: {
        title: title,
        privacy: {
          not: 'DIRECT',
        },
      },
    });

    if (conversation.length > 0) {
      return false;
    }

    return true;
  }
}
