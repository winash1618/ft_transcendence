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

	async findById(uuid: string): Promise<User | null> {
		return await this.prisma.user.findUnique({
			where: {
				id: uuid,
			},
		})
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
