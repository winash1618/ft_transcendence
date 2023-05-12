import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User, UserStatus } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { createInviteDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  async add42User(userDto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: userDto });
    await this.prisma.achievements.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return user;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async users(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(login: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { login },
      select: {
        id: true,
        login: true,
        username: true,
        first_name: true,
        last_name: true,
        profile_picture: true,
        is_authenticated: true,
        user_status: true,
      }
    });
  }

  async getUserByLogin(login: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { login },
      include: { friends: true, sentInvites: true, blocked_users: true },
    });
  }

  async getUserByIdWithParticipants(id: string) {
    return this.prisma.user.findMany({
      where: {
        id: id,
      },
      include: {
        participant_in: true,
      },
    });
  }

  async addFriend(userID: string, friendID: string) {
    if (userID === friendID) {
      throw new Error('You cannot add yourself as a friend');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: userID },
    });
    const friendExists = await this.prisma.user.findUnique({
      where: { id: friendID },
    });

    if (!userExists || !friendExists) {
      throw new Error('One or both users do not exist');
    }

    // Update user's friends list
    const user = await this.prisma.user.update({
      where: { id: userID },
      data: {
        friends: {
          connect: { id: friendID },
        },
        blocked_users: {
          disconnect: { id: friendID },
        },
      },
      include: { friends: true, blocked_users: true },
    });

    // Update friend's friends list
    await this.prisma.user.update({
      where: { id: friendID },
      data: {
        friends: {
          connect: { id: userID },
        },
      },
    });

    return user;
  }

  async unfriend(userID: string, friendID: string) {
    // Check if users exist
    const userExists = await this.prisma.user.findUnique({
      where: { id: userID },
    });
    const friendExists = await this.prisma.user.findUnique({
      where: { id: friendID },
    });

    if (!userExists || !friendExists) {
      throw new Error('One or both users do not exist');
    }

    // Remove the friend connection for both users
    const user = await this.prisma.user.update({
      where: { id: userID },
      data: {
        friends: {
          disconnect: { id: friendID },
        },
      },
      include: { friends: true, blocked_users: true },
    });

    await this.prisma.user.update({
      where: { id: friendID },
      data: {
        friends: {
          disconnect: { id: userID },
        },
      },
    });

    return user;
  }

  async block(userID: string, blockID: string) {
    // Check if users exist
    const userExists = await this.prisma.user.findUnique({
      where: { id: userID },
    });
    const blockExists = await this.prisma.user.findUnique({
      where: { id: blockID },
    });

    if (!userExists || !blockExists) {
      throw new Error('One or both users do not exist');
    }

    if (await this.isUserBlocked(userID, blockID))
      throw new Error('User is already blocked');

    // Block the user
    const user = await this.prisma.user.update({
      where: { id: userID },
      data: {
        blocked_users: {
          connect: { id: blockID },
        },
        friends: {
          disconnect: { id: blockID },
        },
      },
      include: { friends: true, blocked_users: true },
    });

    return user;
  }

  async unblock(userID: string, blockID: string) {
    // Check if users exist
    const userExists = await this.prisma.user.findUnique({
      where: { id: userID },
    });
    const blockExists = await this.prisma.user.findUnique({
      where: { id: blockID },
    });

    if (!userExists || !blockExists) {
      throw new Error('One or both users do not exist');
    }

    // Unblock the user
    const user = await this.prisma.user.update({
      where: { id: userID },
      data: {
        blocked_users: {
          disconnect: { id: blockID },
        },
      },
      include: { friends: true, blocked_users: true },
    });

    return user;
  }

  async getUserById(id: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { friends: true, sentInvites: true, blocked_users: true },
    });
  }

  async getUserIDByUserName(username: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.id;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async updateProfilePicture(id: string, picture: string) {
    return await this.prisma.user.update({
      where: { id },
      data: { profile_picture: picture },
    });
  }

  async userStatusUpdate(id: string, status: string) {
    return await this.prisma.user.update({
      where: { id },
      data: { user_status: UserStatus[status] },
    });
  }

  async updateSecretCode(id: string, secret: string | null) {
    return await this.prisma.user.update({
      where: { id },
      data: { secret_code: secret },
    });
  }

  async updateAuthentication(id: string, is_authenticated: boolean) {
    return await this.prisma.user.update({
      where: { id },
      data: { is_authenticated },
    });
  }

  async updateUserName(id: string, name: string) {
    return await this.prisma.user.update({
      where: { id },
      data: { username: name },
      select: {
        id: true,
        username: true,
        login: true,
      }
    });
  }

  async getUsersApartFromUser(id: string) {
    return this.prisma.user.findMany({
      where: {
        id: {
          not: id,
        },
      },
    });
  }

  async checkIfUserExists(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      return true;
    }
    return false;
  }

  async getUserFriends(userID: string) {
    return this.prisma.user.findMany({
      where: {
        friends: {
          some: {
            id: userID,
          },
        },
      },
      select: {
        id: true,
        username: true,
        user_status: true,
        login: true,
        profile_picture: true,
      },
    });
  }

  async isUserBlocked(blockedUserID: string, blockingUserID: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: blockingUserID,
      },
      select: {
        blocked_users: {
          where: {
            id: blockedUserID,
          },
        },
      },
    });

    return user.blocked_users.length > 0;
  }

  async blockedUsers(userID: string) {
	if (await this.checkIfUserExists(userID) === false)
		throw new Error('User does not exist');
	return this.prisma.user.findMany({
		where: {
			blocked_users: {
				some: {
					id: userID,
				},
			},
		},
		select: {
			id: true,
			username: true,
			login: true,
		},
	});
	}

  async checkIfUserSentThreeInvites(
    senderId: string,
    receiverId: string,
  ): Promise<boolean> {
    const sentInvitesCount = await this.prisma.invitations.count({
      where: {
        type: 'GAME',
        senderId: senderId,
        receiverId: receiverId,
      },
    });

    return sentInvitesCount >= 3;
  }

  async getPendingInvitations(userId: string) {
    const pendingInvitations = await this.prisma.invitations.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      select: {
        id: true,
        type: true,
        username: true,
        senderId: true,
        receiverId: true,
        status: true,
      },
    });

    return pendingInvitations;
  }

  async createInvite(createInviteDto: createInviteDto, senderId: string) {
    const { type, receiverId } = createInviteDto;

    const user = await this.prisma.user.findUnique({
      where: { id: senderId },
      include: { friends: true, sentInvites: true, blocked_users: true }
    });

    const invite = await this.prisma.invitations.create({
      data: {
        type,
        senderId,
        username: user.username,
        receiverId,
        status: 'PENDING',
      },
    });
    if (type === 'GAME') {
      return invite;
    }
    user.sentInvites.push(invite);
    return user;
  }

  async getInvite(id: string) {
    return await this.prisma.invitations.findUnique({
      where: { id },
    });
  }

  async acceptInvite(id: string) {
    const invite = await this.prisma.invitations.findUnique({
      where: { id },
    });

    if (invite.type === 'FRIEND') {
      await this.prisma.user.update({
        where: { id: invite.senderId },
        data: { friends: { connect: { id: invite.receiverId } } },
      });
      await this.prisma.user.update({
        where: { id: invite.receiverId },
        data: { friends: { connect: { id: invite.senderId } } },
      });
      await this.prisma.invitations.deleteMany({
        where: {
          OR: [
            {
              senderId: invite.senderId,
              receiverId: invite.receiverId,
              type: 'FRIEND',
            },
            {
              senderId: invite.receiverId,
              receiverId: invite.senderId,
              type: 'FRIEND',
            },
          ],
        },
      });
    }

    // Delete all the invitation by sender for game
    if (invite.type === 'GAME') {
      await this.prisma.invitations.deleteMany({
        where: {
          senderId: invite.senderId,
          type: 'GAME',
        },
      });

      return invite;
    }

    return await this.prisma.invitations.delete({
      where: { id },
    });
  }

  async rejectInvite(id: string) {
    const invite = await this.prisma.invitations.findUnique({
      where: { id },
    });

    if (invite.type === 'GAME') {
      await this.prisma.invitations.deleteMany({
        where: {
          senderId: invite.senderId,
          type: 'GAME',
        },
      });

      return invite;
    }

    return await this.prisma.invitations.delete({
      where: { id },
    });
  }

  async updateUserStatus(id: string, status: string) {
    return await this.prisma.user.update({
      where: { id },
      data: { user_status: UserStatus[status] },
    });
  }

  async fetchUserStatus(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: { user_status: true },
    });
  }

  async getTotalGamesWon(userID: string) {
    const gamesWon = await this.prisma.user.findUnique({
      where: {
        id: userID,
      },
      select: {
        id: true,
        username: true,
        user_status: true,
        login: true,
        profile_picture: true,
        playerOneHistories: {
          select: {
            id: true,
            winner: true,
            looser: true,
            player_score: true,
            opponent_score: true,
          },
          where: {
            winner: userID,
          },
        },
      },
    });
    return gamesWon.playerOneHistories.length;
  }

  async getTotalGamesPlayed(userID: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userID },
      select: {
        playerOneHistories: {
          select: {
            id: true,
          },
        },
      },
    });

    return user.playerOneHistories.length;
  }

  async getPlayers() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        user_status: true,
        login: true,
        profile_picture: true,
      },
    });
  }

  async getUserAchievements(userID: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userID },
      include: {
        achievements: {
          select: {
            won_three: true,
            played_first: true,
            won_ten: true
          },
        }
      }
    });

    return user.achievements;
  }
}
