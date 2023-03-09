import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CreateGameRoomDto } from './dto/create-gameRoom.dto';

@Injectable()
export class GameService {
	constructor(private prisma: PrismaService) { }
	async create(createGameDto: CreateGameDto) {
		return this.prisma.game.create({ data: createGameDto });
	}

	async createGameRoom(createGameRoomDto: CreateGameRoomDto) {
		return this.prisma.gameRoom.create({ data: createGameRoomDto });
	}


	addPlayerToGame(gameId: number, playerId: number) {
		return this.prisma.game.update({
			where: { id: gameId },
			data: {
				player: {
					connect: { id: playerId },
				},
			},
		});
	}

	addOpponentToGame(gameId: number, opponentId: number) {
		return this.prisma.game.update({
			where: { id: gameId },
			data: {
				player: {
					connect: { id: opponentId },
				},
			},
		});
	}


	addGameRoomToGame(gameId: number, gameRoomId: number) {
		return this.prisma.game.update({
			where: { id: gameId },
			data: {
				gameRoom: {
					connect: { id: gameRoomId },
				},
			},
		});
	}

	addGameToGameRoom(gameRoomId: number, gameId: number) {
		return this.prisma.gameRoom.update({
			where: { id: gameRoomId },
			data: {
				game: {
					connect: { id: gameId },
				},
			},
		});
	}

	addUserToGameRoom(gameRoomId: number, userId: number) {
		return this.prisma.gameRoom.update({
			where: { id: gameRoomId },
			data: {
				user: {
					connect: { id: userId },
				},
			},
		});
	}

	addIsPlayingToUser(userId: number, isPlaying: boolean) {
		return this.prisma.user.update({
			where: { id: userId },
			data: {
				isPlaying: isPlaying,
			},
		});
	}


	queryData(query: any) {

		const queryTest = {
			where: {
				OR: [
				{player : {id : 1 }},
				{player : {opponent : {id : 1 }}},
				]
			},
			select: {
				player: true,
				playerId: true,
				id: true,
				gameRoomId: true,
				gameRoom: true,
				side1: true,
				side2: true,
				ballX1: true,
				ballY1: true,
				ballX2: true,
				ballY2: true,
				isPaused: true,
				map: true,
				status: true,
				player1Score: true,
				player2Score: true,
			},
		};
		return this.prisma.game.findMany(queryTest);
	}

	findAll() {
		return this.prisma.game.findMany();
	}

	findAllGameRooms() {
		return this.prisma.gameRoom.findMany();
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
