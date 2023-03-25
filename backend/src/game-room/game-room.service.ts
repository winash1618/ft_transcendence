import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateGameRoomDto } from './dto/create-game-room.dto';
import { UpdateGameRoomDto } from './dto/update-game-room.dto';

@Injectable()
export class GameRoomService {
	constructor(private prisma: PrismaService) { }
	// create(createGameRoomDto: CreateGameRoomDto) {
	// 	return this.prisma.gameRoom.create({ data: createGameRoomDto });
	// }

	// addGameToGameRoom(gameRoomId: number, gameId: number) {
	// 	return this.prisma.gameRoom.update({
	// 		where: { id: gameRoomId },
	// 		data: {
	// 			game: {
	// 				connect: { id: gameId },
	// 			},
	// 		},
	// 	});
	// }

	// addUserToGameRoom(gameRoomId: number, userId: number) {
	// 	return this.prisma.gameRoom.update({
	// 		where: { id: gameRoomId },
	// 		data: {
	// 			user: {
	// 				connect: { id: userId },
	// 			},
	// 		},
	// 	});
	// }

	// findAllUsersInGameRoom(gameRoomId: number) {
	// 	// return this.prisma.gameRoom.findUnique({
	// 	//     where: { id: gameRoomId },
	// 	//     include: {
	// 	//         user: {
	// 	//             where: { isPlaying: true }
	// 	//         },
	// 	//     },
	// 	// });

	// 	// return this.prisma.gameRoom.findUnique({
	// 	// 	where: { id: gameRoomId },
	// 	// 	include: {
	// 	// 		user: {
	// 	// 			where: {
	// 	// 				gameRoom: {
	// 	// 					some: {
	// 	// 						id: gameRoomId,
	// 	// 					},
	// 	// 				},
	// 	// 			}
	// 	// 		}
	// 	// 	},
	// 	// });
	// 	return this.prisma.gameRoom.findUnique({
	// 		where: { id: gameRoomId },
	// 		include: {
	// 			user: true,
	// 			},
	// 	});
	// 	// return this.prisma.user.findMany({
	// 	// 	where: { gameRoom: {
	// 	// 							some: {
	// 	// 								id: gameRoomId,
	// 	// 							},
	// 	// 						}, },
	// 	// 	include: {
	// 	// 	  gameRoom: true,
	// 	// 	},
	// 	//   });

	// }


	// findAll() {
	// 	return this.prisma.gameRoom.findMany();
	// }

	// findOne(id: number) {
	// 	return this.prisma.gameRoom.findUnique({ where: { id: id } });
	// }

	// update(id: number, updateGameRoomDto: UpdateGameRoomDto) {
	// 	return this.prisma.gameRoom.update({ where: { id: id }, data: updateGameRoomDto });
	// }

	// remove(id: number) {
	// 	return this.prisma.gameRoom.delete({ where: { id: id } });
	// }
}
