import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseFilters,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  UseInterceptors,
  Req,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Res,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';
import { JwtAuthGuard } from 'src/utils/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { join } from 'path';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

// dont add @UseGuards(JwtAuthGuard) here because get profile picture does not need it
@Controller('users')
@ApiTags('users')
@UseFilters(PrismaClientExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('profile-image/:filename/:token')
  async getProfilePhoto(
    @Param('filename') filename: string,
    @Param('token') token: string,
    @Res() res: Response,
  ) {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      if (!decodedToken) {
        throw new BadRequestException('Invalid token');
      }
      const user = await this.usersService.findOne(filename.substring(0, filename.lastIndexOf('.')));
      if (
        !user ||
        user.blocked_users.some(
          user =>
            user.id === decodedToken.id,
        )
      ) {
        throw new BadRequestException('Invalid token');
      }
      const filePath = join(__dirname, '../../../', 'uploads', `${filename}`);
      return res.sendFile(filePath);
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile-image')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadProfilePhoto(
    @Req() request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    const decodedToken = this.jwtService.verify(
      request.headers.authorization.split(' ')[1],
      { secret: process.env.JWT_SECRET },
    );
    const user = await this.usersService.updateProfilePicture(
      decodedToken.id,
      image.filename,
    );
    return { user };
  }

  // @Get()
  // findAll() {
  // 	return this.usersService.users();
  // }

  @UseGuards(JwtAuthGuard)
  @Get(':login')
  async findOne(@Req() req, @Param('login') login: string) {
    const user = await this.usersService.findOne(login);
    if (!user || user.blocked_users.some(user => user.id === req.user.id)) {
      throw new NotFoundException(`User #${login}: not found`);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
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
  async updateUserName(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() data: { name: string },
  ) {
    return await this.usersService.updateUserName(uuid, data.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('friends/:uuid')
  async getFriends(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return await this.usersService.getUserFriends(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-invite')
  async createInvite(
    @Body() createInviteDto: any,
    @Req() req,
    @Res() res: Response
  ): Promise<void> {
    try {
      const invitation = await this.usersService.createInvite(createInviteDto, req.user.id);
      res.status(201).json(invitation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/accept')
  async acceptInvite(
    @Param('id') id: string,
    @Req() req,
    @Res() res: Response
  ): Promise<void> {
    try {
      const invitation = await this.usersService.acceptInvite(id, req.user.id);
      res.status(200).json(invitation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/reject')
  async rejectInvite(
    @Param('id') id: string,
    @Req() req,
    @Res() res: Response
  ): Promise<void> {
    try {
      const invitation = await this.usersService.rejectInvite(id, req.user.id);
      res.status(200).json(invitation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userID/unfriend/:friendID')
  async unfriend(
    @Param('userID') userID: string,
    @Param('friendID') friendID: string,
  ) {
    return await this.usersService.unfriend(userID, friendID);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':userID/block/:blockID')
  async block(
    @Param('userID') userID: string,
    @Param('blockID') blockID: string,
  ) {
    return await this.usersService.block(userID, blockID);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userID/unblock/:blockID')
  async unblock(
    @Param('userID') userID: string,
    @Param('blockID') blockID: string,
  ) {
    return await this.usersService.unblock(userID, blockID);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userID/status')
  async GetUserStatus(@Param('userID') userID: string) {
    return await this.usersService.fetchUserStatus(userID);
  }
}
