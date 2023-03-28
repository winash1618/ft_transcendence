import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseFilters, ParseUUIDPipe } from '@nestjs/common';
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

	// @Get()
	// findAll() {
	// 	return this.usersService.users();
	// }

	@Get(':uuid')
	async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
		const user = await this.usersService.findById(uuid);
		if (!user) {
			throw new NotFoundException(`User #${uuid}: not found`);
		}
		return user;
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.usersService.remove(+id);
	}
}
