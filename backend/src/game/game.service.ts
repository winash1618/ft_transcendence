import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class GameService {
	constructor(private prisma: PrismaService) { }
	async create(createGameDto: CreateGameDto) {
		// const result = await this.prisma.game.create({
		// 	data: {
		// 		gameInfoId: createGameDto.gameInfoId,
		// 		player1Id: createGameDto.player1Id,
		// 		player2Id: createGameDto.player2Id,
		// 		winnerId: createGameDto.winnerId,
		// 		gameInfo: {
		// 			create: {
		// 				ballX: createGameDto.gameInfo.ballX,
		// 				ballY: createGameDto.gameInfo.ballY,
		// 				isPaused: createGameDto.gameInfo.isPaused,
		// 				map: createGameDto.gameInfo.map,
		// 			},,
		// 		},
		// 	},
		// });
		// https://stackoverflow.com/questions/70131425/nestjs-prisma-how-to-create-record-with-relational-fields
		// const result = await this.prisma.game.create({
		// 	data: {
		// 		name: createUserDto.name,
		// 		email: createUserDto.email,
		// 		age: createUserDto.age,
		// 		password: passwordHash,
		// 		roleId: createUserDto.roleId,
		// 		address: {
		// 			create: {
		// 				street: createUserDto.address.street,
		// 				number: createUserDto.address.number,
		// 				complement: createUserDto.address.complement,
		// 				neighborhood: createUserDto.address.neighborhood,
		// 				cityId: createUserDto.address.cityId,
		// 				stateId: createUserDto.address.stateId,
		// 				zipcode: createUserDto.address.zipcode
		// 			},
		// 		},
		// 	},
		// });
		return this.prisma.game.create({ data: createGameDto });
		// return result;
	}

	findAll() {
		return this.prisma.game.findMany();
	}

	findOne(id: number) {
		return this.prisma.game.findUnique({ where: { id } });
	}

	update(id: number, updateGameDto: UpdateGameDto) {
		return this.prisma.game.update({ where: { id }, data: updateGameDto });
	}

	remove(id: number) {
		return this.prisma.game.delete({ where: { id } });
	}
}
