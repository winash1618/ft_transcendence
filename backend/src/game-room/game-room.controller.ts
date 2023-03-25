import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('game-room')
@ApiTags('game-room')
export class GameRoomController {
	// constructor(private readonly gameRoomService: GameRoomService) { }

	// @Post()
	// create(@Body() createGameRoomDto: CreateGameRoomDto) {
	// 	return this.gameRoomService.create(createGameRoomDto);
	// }

	// @Get(':gameRoomAddUser')
	// addUserToGameRoom() {
	// 	return this.gameRoomService.addUserToGameRoom(1, 2);
	// }

	// @Get(':addGameToGameRoom')
	// addGameToGameRoom() {
	// 	return this.gameRoomService.addGameToGameRoom(1, 3);
	// }

	// @Get()
	// findAll() {
	// 	return this.gameRoomService.findAll();
	// }

	// @Get(':findAllUsersInGameRoom')
	// findAllUsersInGameRoom() {
	//   return this.gameRoomService.findAllUsersInGameRoom(2);
	// }


	// @Get(':id')
	// findOne(@Param('id') id: string) {
	// 	return this.gameRoomService.findOne(+id);
	// }

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateGameRoomDto: UpdateGameRoomDto) {
	// 	return this.gameRoomService.update(+id, updateGameRoomDto);
	// }

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	// 	return this.gameRoomService.remove(+id);
	// }
}
