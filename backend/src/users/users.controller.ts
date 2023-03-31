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

	// @Get()
	// findAll() {
	// 	return this.usersService.users();
	// }

	@Get(':id')
	async findOne(@Param('id') email: string) {
		const user = await this.usersService.findOne(email);
		if (!user) {
			throw new NotFoundException(`User #${email}: not found`);
		}
		return user;
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.usersService.remove(+id);
	}

  @Patch(':id')
  async userStatusUpdate(@Param('id') id: string, @Body() status: string) {
    return await this.usersService.userStatusUpdate(id, status);
  }

  @Patch(':id')
  async updateUserName(@Param('id') id: string, @Body() name: string) {
    return await this.usersService.updateUserName(id, name);
  }
}
