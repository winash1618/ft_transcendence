import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
          data: {
              username: createUserDto.login,
              email: createUserDto.email,
              first_name: createUserDto.first_name,
              last_name: createUserDto.last_name,
              intra_id: createUserDto.id,
          },
      });
      return user;
  } catch (error) {
      //console.log('error:', error);
      if (error instanceof PrismaClientKnownRequestError) {
          throw error;
      }
  }
    // return 'This action adds a new user';
  }

  async users(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
