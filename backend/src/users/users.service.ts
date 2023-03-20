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

	findAllgameRoomsInUser(userId: number) {
		return this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				gameRoom: true,
			},
		});
	}

	async users(): Promise<User[]> {
		return this.prisma.user.findMany();
	}

  async findOne(login: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { login } });
  }

	async addGameResult(userId: number, userScore: number, opponentScore: number) {
		// const Record = this.prisma.matchHistory.create({
		// 	data: {
		// 		userId: userId,
		// 		userScore: userScore,
		// 		oppenentScore: oppenentScore,
		// 	},
		// });
		// const statId = this.prisma.matchHistory.findUnique({
		// 	where: { id: (await Record).id },
		// 	select: { id: true },
		// });
		// const user = this.prisma.user.findUnique({
		// 	where: { id: userId },
		// 	select: { id: true, GameRecord: true },
		// });
		return this.prisma.user.update({
			where: { id: userId },
			data: {
				GameRecord: {
					create: {
						userScore: userScore,
						opponentScore: opponentScore,
					},
				},
			},
		});
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
