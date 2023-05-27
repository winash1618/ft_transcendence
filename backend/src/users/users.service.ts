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

  async findOneID(id: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOneLogin(login: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { login },
    });
  }

  async findOne(login: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { login },
      select: {
        id: true,
        login: true,
        username: true,
        first_name: true,
        last_name: true,
        profile_picture: true,
        is_authenticated: true,
        secret_code: true,
        user_status: true,
      },
    });
    if (user) {
      const totalGamesPlayed = await this.getTotalGamesPlayed(user.id);
      const totalGamesWon = await this.getTotalGamesWon(user.id);
      return {
        ...user,
        rating:
          800 + totalGamesWon * 10 - (totalGamesPlayed - totalGamesWon) * 8,
      };
    } else {
      return user;
    }
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

    if (await this.isUserBlocked(userID, friendID))
      throw new Error('User is blocked');

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
      include: {
        friends: true,
        blocked_users: true,
        sentInvites: true,
        receivedInvites: true,
      },
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

    if (await this.isUserBlocked(userID, friendID))
      throw new Error('User is blocked');

    if (await this.areUsersFriends(userID, friendID) === false)
      throw new Error('Users are not friends');

    // Remove the friend connection for both users
    const user = await this.prisma.user.update({
      where: { id: userID },
      data: {
        friends: {
          disconnect: { id: friendID },
        },
      },
      select: {
        id: true,
        login: true,
        username: true,
        first_name: true,
        last_name: true,
        profile_picture: true,
        user_status: true,
      }
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

    await this.prisma.invitations.deleteMany({
      where: {
        OR: [
          {
            senderId: userExists.id,
            receiverId: blockExists.id,
          },
          {
            senderId: blockExists.id,
            receiverId: userExists.id,
          }
        ]
      }
    });

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
      select: {
        id: true,
        login: true,
        username: true,
        first_name: true,
        last_name: true,
        profile_picture: true,
        user_status: true,
      }
    });

    await this.prisma.user.update({
      where: { id: blockID },
      data: {
        friends: {
          disconnect: { id: userID },
        },
      },
      include: {
        friends: true,
        blocked_users: true,
        sentInvites: true,
        receivedInvites: true,
      },
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

    if ((await this.isUserBlocked(userID, blockID)))
      throw new Error('User is not blocked');

    // Unblock the user
    const user = await this.prisma.user.update({
      where: { id: userID },
      data: {
        blocked_users: {
          disconnect: { id: blockID },
        },
      },
      select: {
        id: true,
        login: true,
        username: true,
        first_name: true,
        last_name: true,
        profile_picture: true,
        user_status: true,
      }
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
      // select: {
      //   id: true,
      //   login: true,
      //   username: true,
      //   first_name: true,
      //   last_name: true,
      //   profile_picture: true,
      // }
    });
  }

  async userStatusUpdate(id: string, status: string) {
    return await this.prisma.user.update({
      where: { id },
      data: { user_status: UserStatus[status] },
    });
  }

  async updateSecretCode(id: string, secret: string | null) {
    let scode = null;
    if (secret) {
      scode = 'YES';
    }
    const code = await this.prisma.user.update({
      where: { id },
      data: { secret_code: scode, is_authenticated: true, Twofa_secret: secret },
      select: {
        id: true,
        login: true,
        username: true,
        first_name: true,
        last_name: true,
        profile_picture: true,
        is_authenticated: true,
        secret_code: true,
        user_status: true,
      },
    });

    return code;
  }

  async updateAuthentication(id: string, is_authenticated: boolean) {
    return await this.prisma.user.update({
      where: { id },
      data: { is_authenticated },
    });
  }

  async updateUserName(id: string, name: string) {
    const nickname = await this.prisma.user.findUnique({
      where: { username: name },
    });

    if (nickname) throw new Error('Username already exists');

    return await this.prisma.user.update({
      where: { id },
      data: { username: name },
      // select: {
      //   id: true,
      //   login: true,
      //   username: true,
      //   first_name: true,
      //   last_name: true,
      //   profile_picture: true,
      // }
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

  async isBothUsersBlocked(userId1: string, userId2: string): Promise<boolean> {
    const user1 = await this.prisma.user.findUnique({
        where: { id: userId1 },
        select: { blocked_users: { select: { id: true } } }
    });

    const user2 = await this.prisma.user.findUnique({
        where: { id: userId2 },
        select: { blocked_users: { select: { id: true } } }
    });

    const user1BlockedUsersIds = user1?.blocked_users.map(user => user.id) || [];
    const user2BlockedUsersIds = user2?.blocked_users.map(user => user.id) || [];

    return user1BlockedUsersIds.includes(userId2) || user2BlockedUsersIds.includes(userId1);
}

  async blockedUsers(userID: string) {
    if ((await this.checkIfUserExists(userID)) === false)
      throw new Error('User does not exist');
    const blocked = await this.prisma.user.findUnique({
      where: {
        id: userID,
      },
      select: {
        blocked_users: {
          select: {
            id: true,
            login: true,
            username: true,
          },
        },
        blocked_by: {
          select: {
            id: true,
            login: true,
            username: true,
          },
        },
      },
    });

    const combinedBlockedUsers = [
      ...blocked.blocked_users,
      ...blocked.blocked_by,
    ];

    return combinedBlockedUsers;
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

    if (await this.checkIfUserExists(receiverId) === false)
      throw new Error('User does not exist');

    if (await this.isBothUsersBlocked(receiverId, senderId))
      throw new Error('User is blocked');

    if (type === 'FRIEND' && await this.areUsersFriends(senderId, receiverId) === true)
      throw new Error('Users are friends');

    const user = await this.prisma.user.findUnique({
      where: { id: senderId },
      select: {
        id: true,
        username: true,
        login: true,
        sentInvites: true,
        first_name: true,
        last_name: true,
        profile_picture: true,
      }
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

  async areUsersFriends(userId1: string, userId2: string): Promise<boolean> {
    const user1 = await this.prisma.user.findUnique({
        where: { id: userId1 },
        select: { friends: { select: { id: true } } }
    });

    const user2 = await this.prisma.user.findUnique({
        where: { id: userId2 },
        select: { friends: { select: { id: true } } }
    });

    const user1FriendsIds = user1?.friends.map(friend => friend.id) || [];
    const user2FriendsIds = user2?.friends.map(friend => friend.id) || [];

    return user1FriendsIds.includes(userId2) && user2FriendsIds.includes(userId1);
}

  async acceptInvite(id: string, receiverId: string) {
    const invite = await this.prisma.invitations.findUnique({
      where: { id },
    });

    if (!invite) throw new Error('Invite does not exist');

    if (await this.isBothUsersBlocked(invite.senderId, receiverId))
      throw new Error('User is blocked');

    if (await this.checkInvitedUsers(id, receiverId) === false)
      throw new Error('Invite does not exist');

    if (!invite) throw new Error('Invite does not exist');

    if (invite.type === 'FRIEND') {
      if (await this.areUsersFriends(invite.senderId, invite.receiverId))
        throw new Error('Users are already friends');
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
          OR: [
            {
              senderId: invite.senderId,
              receiverId: invite.receiverId,
              type: 'GAME',
            },
            {
              senderId: invite.receiverId,
              receiverId: invite.senderId,
              type: 'GAME',
            },
          ],
        },
      });

      return invite;
    }
    return invite;
  }

  async rejectInvite(id: string) {
    const invite = await this.prisma.invitations.findUnique({
      where: { id },
    });

    if (!invite) throw new Error('Invite does not exist');

    if (invite.type === 'GAME') {
      await this.prisma.invitations.deleteMany({
        where: {
          OR: [
            {
              senderId: invite.senderId,
              receiverId: invite.receiverId,
              type: 'GAME',
            },
            {
              senderId: invite.receiverId,
              receiverId: invite.senderId,
              type: 'GAME',
            },
          ],
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

  async checkInvitedUsers(id: string, receiverId: string) {
    const invite = await this.prisma.invitations.findUnique({
      where: { id },
    });

    if (!invite) throw new Error('Invite does not exist');

    if (invite.receiverId !== receiverId)
      throw new Error('User is not invited');

    return true;
  }

  async fetchUserStatus(id: string) {
    if ((await this.checkIfUserExists(id)) === false)
      throw new Error('User does not exist');
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
            won_ten: true,
          },
        },
      },
    });

    return user.achievements;
  }

  async searchUsers(searchTerm: string) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            first_name: {
              contains: searchTerm,
              mode: 'insensitive', // case insensitive
            },
          },
          {
            last_name: {
              contains: searchTerm,
              mode: 'insensitive', // case insensitive
            },
          },
          {
            login: {
              contains: searchTerm,
              mode: 'insensitive', // case insensitive
            },
          },
          {
            username: {
              contains: searchTerm,
              mode: 'insensitive', // case insensitive
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        login: true,
        user_status: true,
      },
    });

    return users;
  }
}
