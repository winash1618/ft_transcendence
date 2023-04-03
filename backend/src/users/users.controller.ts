import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseFilters, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';
import { JwtAuthGuard } from 'src/utils/guards/jwt.guard';

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

	@Get(':login')
	async findOne(@Param('login') login: string) {
		const user = await this.usersService.findOne(login);
		if (!user) {
			throw new NotFoundException(`User #${login}: not found`);
		}
		return user;
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.usersService.remove(+id);
	}

//   @Patch(':id')
//   async userStatusUpdate(@Param('id') id: string, @Body() data: { status: string; }) {
//     return await this.usersService.userStatusUpdate(id, data.status);
//   }

  @UseGuards(JwtAuthGuard)
  @Patch(':uuid')
  async updateUserName(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Body() data: { name: string; }) {
    return await this.usersService.updateUserName(uuid, data.name);
  }
}
