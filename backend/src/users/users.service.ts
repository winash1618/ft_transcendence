import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  async add42User(userDto: CreateUserDto) {
    return await this.prisma.user.create({ data: userDto});
  }

  async users(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  updateRefreshToken(email: string, refreshUpdate: UpdateUserDto) {
    return this.prisma.user.update({
      where: { email },
      data: refreshUpdate,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
