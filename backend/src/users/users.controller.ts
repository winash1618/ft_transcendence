import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, ParseUUIDPipe, UseGuards, HttpCode, UseInterceptors, Req, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Res, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';
import { JwtAuthGuard } from 'src/utils/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { join } from 'path';
import { Response, Request } from 'express';
import { readFile } from 'fs/promises';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
@ApiTags('users')
@UseGuards(JwtAuthGuard)
@UseFilters(PrismaClientExceptionFilter)
export class UsersController {
	constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) { }

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

    @Get('profile-image/:filename')
  async getProfilePhoto(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = join(__dirname, '../../../', 'uploads', `${filename}`);
	return res.sendFile(filePath);
  }

  	@UseGuards(JwtAuthGuard)
	@Post('profile-image')
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('file', multerConfig))
    async uploadProfilePhoto(
        @Req() request: Request,
        @UploadedFile(
            new ParseFilePipe({
				validators: [
				  new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
				  new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
				],
			  }),
        )
        image: Express.Multer.File
    ) {
		const user = this.jwtService.verify(request.headers.authorization.split(' ')[1], { secret: process.env.JWT_SECRET });
		this.usersService.updateProfilePicture(user.id, image.filename);
		return { profileImg: image.filename };
    }

	// @Get()
	// findAll() {
	// 	return this.usersService.users();
	// }

  @Get(':login')
  async findOne(@Param('login') login: string) {
    const user = await this.usersService.findOne(login);
    if (!user) {
      throw new Error(`User #${login}: not found`);
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

  @Patch(':uuid')
  async updateUserName(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() data: { name: string },
  ) {
    return await this.usersService.updateUserName(uuid, data.name);
  }

  @Get('friends/:uuid')
  async getFriends(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return await this.usersService.getUserFriends(uuid);
  }

  @Post(':userID/add-friend/:friendID')
  async addFriend(@Param('userID') userID: string, @Param('friendID') friendID: string) {
    return await this.usersService.addFriend(userID, friendID);
  }

  @Delete(':userID/unfriend/:friendID')
  async unfriend(@Param('userID') userID: string, @Param('friendID') friendID: string) {
    return await this.usersService.unfriend(userID, friendID);
  }

  @Post(':userID/block/:blockID')
  async block(@Param('userID') userID: string, @Param('blockID') blockID: string) {
    return await this.usersService.block(userID, blockID);
  }

  @Delete(':userID/unblock/:blockID')
  async unblock(@Param('userID') userID: string, @Param('blockID') blockID: string) {
    return await this.usersService.unblock(userID, blockID);
  }
}
