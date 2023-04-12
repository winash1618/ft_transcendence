import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Privacy, Role, Status } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateConversationDto, UpdateConversationDto } from '../dto/conversation.dto';
import * as brypt from 'bcrypt';
import { ParticipantService } from './participant.service';
import { UsersService } from 'src/users/users.service';

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
    if (createConversation.privacy === 'PROTECTED' &&
      (createConversation.password === '' || createConversation.password === undefined)
    ) {
      throw new Error('Password is required for Protected conversation');
    }

    if (createConversation.privacy === 'PROTECTED') {
      createConversation.password = await this.hashPassword(createConversation.password);
    }

    try {
      const conversation = await this.prisma.conversation.create({
        data: {
          title: createConversation.title,
          creator_id: createConversation.creator_id,
          password: createConversation.password,
          privacy: Privacy[createConversation.privacy],
        },
      });
      return conversation;
    } catch (e) {
      throw new Error(e);
    }
  }

  async protectConversation(conversationID: string, password: string) {
    const conversation = await this.checkConversationExists(conversationID);

    if (conversation.privacy === Privacy.PROTECTED) {
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

  async removePasswordFromConversation(conversationID: string) {
    const conversation = await this.checkConversationExists(conversationID);

    if (conversation.privacy !== Privacy.PROTECTED) {
      throw new Error('Conversation is not protected');
    }

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

  async createDirectConversation(createConversation: CreateConversationDto, userID: string, otherUserID: string) {
    if (this.checkDirectConversationExists(userID, otherUserID)) {
      throw new Error('Direct conversation already exists');
    }

    if (userID === otherUserID) {
      throw new Error('Cannot create direct conversation with yourself');
    }

    if (this.userService.isUserBlocked(userID, otherUserID)) {
      throw new Error('User is blocked');
    }

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
      role: Role['MEMBER'],
      conversation_status: 'ACTIVE',
    });

    return conversation;
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
    if (this.userService.checkIfUserExists(userID)) {
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
      },
    });
  }

  async findChannelsThatUserIsNotIn(userID: string) {
    if (this.userService.checkIfUserExists(userID)) {
      throw new Error('User does not exist');
    }

    return await this.prisma.conversation.findMany({
      where: {
        privacy: {
          in: [Privacy.PUBLIC, Privacy.PROTECTED],
        },
        participants: {
          every: {
            user_id: {
              not: userID,
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
      },
    });
  }

  async friendsNotInConversation(userID: string, conversationID: string) {
    if (this.userService.checkIfUserExists(userID)) {
      throw new Error('User does not exist');
    }

    if (this.checkConversationExists(conversationID)) {
      throw new Error('Conversation does not exist');
    }

    if (!this.participantService.isUserAdminInConversation(userID, conversationID)) {
      throw new Error('User is not admin of the conversation');
    }

    const friends = await this.prisma.user.findUnique({
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
        },
      },
    });

    return friends?.friends || [];
  }

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
        messages: true,
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
            messages: true,
          },
        }
      },
    });
  }

  async getConversationByUserIDAndSortedMessages(userID: string) {
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
            messages: {
              orderBy: {
                created_at: 'desc',
              },
              take: 1,
            },
          },
        },
        messages: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
        },
      },
    });
  }
}
