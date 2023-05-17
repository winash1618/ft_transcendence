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
  UsePipes,
  ValidationPipe,
  Query
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';
import { JwtAuthGuard } from 'src/utils/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { join } from 'path';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from 'src/utils/uuid.dto';
import { createInviteDto } from './dto/users.dto';
import { ConfigService } from '@nestjs/config';

@Controller('users')
@ApiTags('users')
@UseFilters(PrismaClientExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService
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
        secret: this.configService.get('JWT_SECRET'),
      });
      if (!decodedToken) {
        throw new BadRequestException('Invalid token');
      }
      const user = await this.usersService.findOne(
        filename.substring(0, filename.lastIndexOf('.')),
      );
      if (
        !user ||
        user.blocked_users.some(user => user.id === decodedToken.id)
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
          new MaxFileSizeValidator({ maxSize: (1024 * 1024) * 4 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    const decodedToken = this.jwtService.verify(
      request.headers.authorization.split(' ')[1],
      { secret: this.configService.get('JWT_SECRET') },
    );
    const user = await this.usersService.updateProfilePicture(
      decodedToken.id,
      image.filename,
    );
    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Req() req, @Param() params: loginDto) {
    // if (req.user.login !== params.login)
    //   throw new BadRequestException('You do not have permission to access this user.');
    const user = await this.usersService.findOne(params.login);
    if (!user || await this.usersService.isUserBlocked(req.user.id, user.id)) {
      throw new NotFoundException(`User #${params.login}: not found`);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':uuid')
  async updateUserName(
    @Req() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() data: { name: string },
  ) {
    try {
      console.log(req.user.id, uuid)
      if (req.user.id !== uuid)
        throw new BadRequestException('You do not have permission to access this user.');
      const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

      if (!usernameRegex.test(data.name)) {
        throw new BadRequestException('Invalid username');
      }
      const name = await this.usersService.updateUserName(uuid, data.name);
      return { name };
    }
    catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('friends/:uuid')
  async getFriends(@Req() req, @Param('uuid', ParseUUIDPipe) uuid: string) {
    // if (req.user.id !== uuid)
    //   throw new BadRequestException('You do not have permission to access this user.');
    return await this.usersService.getUserFriends(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-invite')
  async createInvite(
    @Body() createInviteDto: createInviteDto,
    @Req() req,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const invitation = await this.usersService.createInvite(
        createInviteDto,
        req.user.id,
      );
      res.status(201).json(invitation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/accept')
  async acceptInvite(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // if (req.user.id !== id)
      //   throw new BadRequestException('You do not have permission to access this user.');
      const invitation = await this.usersService.acceptInvite(id);
      res.status(200).json(invitation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/reject')
  async rejectInvite(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // if (req.user.id !== id)
      //   throw new BadRequestException('You do not have permission to access this user.');
      const invitation = await this.usersService.rejectInvite(id);
      res.status(200).json('Invitation rejected');
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userID/unfriend/:friendID')
  async unfriend(
    @Req() req,
    @Param('userID', ParseUUIDPipe) userID: string,
    @Param('friendID', ParseUUIDPipe) friendID: string,
    @Res() res: Response,
  ) {
    // if (req.user.id !== userID)
    //   throw new BadRequestException('You do not have permission to access this user.');
    if (userID === friendID)
      throw new BadRequestException('You can not unfriend yourself.');
    const user = await this.usersService.unfriend(userID, friendID);
    res.status(200).json(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userID/invitations')
  async getInvitations(@Req() req, @Param('userID', ParseUUIDPipe) userID: string) {
    // if (req.user.id !== userID)
    //   throw new BadRequestException('You do not have permission to access this user.');
    return await this.usersService.getPendingInvitations(userID);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':userID/block/:blockID')
  async block(
    @Req() req,
    @Param('userID', ParseUUIDPipe) userID: string,
    @Param('blockID', ParseUUIDPipe) blockID: string,
    @Res() res: Response,
  ) {
    // if (req.user.id !== userID)
    //   throw new BadRequestException('You do not have permission to access this user.');
    if (userID === blockID)
      throw new BadRequestException('You can not block yourself.');
    const user = await this.usersService.block(userID, blockID);
    res.status(200).json(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userID/unblock/:blockID')
  async unblock(
    @Req() req,
    @Param('userID', ParseUUIDPipe) userID: string,
    @Param('blockID', ParseUUIDPipe) blockID: string,
    @Res() res: Response,
  ) {
    // if (req.user.id !== userID)
    //   throw new BadRequestException('You do not have permission to access this user.');
    if (userID === blockID)
      throw new BadRequestException('You can not unblock yourself.');
    const user = await this.usersService.unblock(userID, blockID);
    res.status(200).json(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userID/status')
  async GetUserStatus(@Req() req, @Param('userID', ParseUUIDPipe) userID: string) {
    // if (req.user.id !== userID)
    //   throw new BadRequestException('You do not have permission to access this user.');
    return await this.usersService.fetchUserStatus(userID);
  }

  @UseGuards(JwtAuthGuard)
  @Get('achievements/:userID')
  async getUserAchievements(@Param('userID', ParseUUIDPipe) userID: string) {
    return await this.usersService.getUserAchievements(userID);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/leaderboard/leaders')
  async getLeaderboard() {
    try {
      const getPlayers = await this.usersService.getPlayers();
      const rankList = [];
      await Promise.all(
        getPlayers.map(async player => {
          const totalGamesPlayed = await this.usersService.getTotalGamesPlayed(
            player.id,
          );
          const totalGamesWon = await this.usersService.getTotalGamesWon(
            player.id,
          );
          rankList.push({
            rank: 0,
            profile_picture: player.profile_picture,
            login: player.login,
            rating:
              800 + totalGamesWon * 10 - (totalGamesPlayed - totalGamesWon) * 8,
          });
        }),
      );
      rankList.sort((a, b) => b.rating - a.rating);
      rankList.forEach((player, index) => {
        player.rank = index + 1;
      });
      return rankList;
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/blockedUsers/:userID')
  async getBlockedUsers(@Req() req, @Param('userID', ParseUUIDPipe) userID: string) {
	if (req.user.id !== userID)
	  throw new BadRequestException('You do not have permission to access this user.');
	return await this.usersService.blockedUsers(userID);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/search')
  async searchUsers(
    @Query('search') search: string,
  ) {
    console.log(search);
    return await this.usersService.searchUsers(search);
  }
}
