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

	async findOne(login: string): Promise<User | null> {
		return await this.prisma.user.findUnique({ where: { login } });
	}

	updateRefreshToken(login: string, refreshUpdate: UpdateUserDto) {
		return this.prisma.user.update({
			where: { login },
			data: refreshUpdate,
		});
	}

	// async getUserObjectWithParticipants(id: string) {
	// 	return await this.prisma.user.findUnique({
	// 		where: {
	// 			id: id,
	// 		},
	// 		include: {
	// 			participant_in: true,
	// 		},
	// 	});
	// }

}
