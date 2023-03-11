import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';

@Controller('users')
@ApiTags('users')
@UseFilters(PrismaClientExceptionFilter)
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.usersService.users();
	}

	@Get(':findAllGameRoomsInUser')
	findAllgameRoomsInUser() {
		return this.usersService.findAllgameRoomsInUser(1);
	}

	@Get(':id')
	async findOne(@Param('id') email: string) {
		const user = await this.usersService.findOne(email);
		if (!user) {
			throw new NotFoundException(`User #${email}: not found`);
		}
		return user;
	}

	@Patch(':AddGameResult')
	async addGameResult(@Param('AddGameResult') id: number) {
		const user = await this.usersService.addGameResult(1, 1, 1);
		if (!user) {
			throw new NotFoundException(`User #${id}: not found`);
		}
		return user;
	}


	@Patch(':id')
	update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(+id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.usersService.remove(+id);
	}
}
