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
import { BlockDto, FriendDto, UserIDDto, loginDto } from 'src/utils/uuid.dto';
import { GetProfilePhotoDto, UpdateUserNameDto, createInviteDto } from './dto/users.dto';

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
    @Param(new ValidationPipe({ transform: true })) params: GetProfilePhotoDto,
    @Res() res: Response,
  ) {
    try {
      const decodedToken = this.jwtService.verify(params.token, {
        secret: process.env.JWT_SECRET,
      });
      if (!decodedToken) {
        throw new BadRequestException('Invalid token');
      }
      const user = await this.usersService.findOne(params.filename.substring(0, params.filename.lastIndexOf('.')));
      if (
        !user ||
        user.blocked_users.some(
          user =>
            user.id === decodedToken.id,
        )
      ) {
        throw new BadRequestException('Invalid token');
      }
      const filePath = join(__dirname, '../../../', 'uploads', `${params.filename}`);
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
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Req() req, @Param('login', new ValidationPipe({ transform: true })) login: loginDto) {
    const user = await this.usersService.findOne(login.username);
    if (!user || user.blocked_users.some(user => user.id === req.user.id)) {
      throw new NotFoundException(`User #${login}: not found`);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':userID')
  async updateUserName(
    @Param('userID', new ParseUUIDPipe()) userID: string,
    @Body(new ValidationPipe({ transform: true })) data: UpdateUserNameDto,
  ) {
    return await this.usersService.updateUserName(userID, data.name);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('friends/:userID')
  async getFriends(@Param('userID', new ParseUUIDPipe()) uuid: UserIDDto) {
    return await this.usersService.getUserFriends(uuid.userID);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-invite')
  async createInvite(
    @Body(new ValidationPipe({ transform: true })) params: createInviteDto,
    @Req() req,
    @Res() res: Response
  ): Promise<void> {
    try {
      const invitation = await this.usersService.createInvite(params, req.user.id);
      res.status(201).json(invitation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put(':userID/accept')
  async acceptInvite(
    @Param('userID') id: UserIDDto,
    @Res() res: Response
  ): Promise<void> {
    try {
      const invitation = await this.usersService.acceptInvite(id.userID);
      res.status(200).json(invitation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put(':userID/reject')
  async rejectInvite(
    @Param('userID') id: UserIDDto,
    @Res() res: Response
  ): Promise<void> {
    try {
      const invitation = await this.usersService.rejectInvite(id.userID);
      res.status(200).json(invitation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Delete(':userID/unfriend/:friendID')
  async unfriend(
    @Param(new ValidationPipe({ transform: true })) params: FriendDto,
  ) {
    return await this.usersService.unfriend(params.userID, params.friendID);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get(':userID/invitations')
  async getInvitations(@Param('userID') userID: UserIDDto) {
    return await this.usersService.getPendingInvitations(userID.userID);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':userID/block/:blockID')
  async block(
    @Param(new ValidationPipe({ transform: true })) params: BlockDto,
  ) {
    return await this.usersService.block(params.userID, params.blockID);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userID/unblock/:blockID')
  async unblock(
    @Param(new ValidationPipe({ transform: true })) params: BlockDto,
  ) {
    return await this.usersService.unblock(params.userID, params.blockID);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get(':userID/status')
  async GetUserStatus(@Param('userID') userID: UserIDDto) {
    return await this.usersService.fetchUserStatus(userID.userID);
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
		getPlayers.map(async (player) => {
		  const totalGamesPlayed = await this.usersService.getTotalGamesPlayed(
			player.id
		  );
		  const totalGamesWon = await this.usersService.getTotalGamesWon(
			player.id
		  );
		  console.log(totalGamesPlayed, totalGamesWon);
		  rankList.push({
			rank: 0,
			profile_picture: player.profile_picture,
			login: player.login,
			rating:
			  800 +
			  totalGamesWon * 10 -
			  (totalGamesPlayed - totalGamesWon) * 8,
		  });
		})
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
}
