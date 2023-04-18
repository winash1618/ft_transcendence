import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User, UserStatus } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  async add42User(userDto: CreateUserDto) {
    return await this.prisma.user.create({ data: userDto });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async users(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(login: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { login } });
  }

  async getUserByLogin(login: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { login } });
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

  async getUserById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
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
        username: true,
        user_status: true,
      }
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
}
