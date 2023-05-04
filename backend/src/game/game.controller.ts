import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt.guard';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService, private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('history/:id')
  async getGameHistory(
    @Req() req,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      console.log('here', id)
      const gameHistory = await this.gameService.getGameHistory(id);
      const user = await this.usersService.getUserById(id);
      if (user.blocked_users.some(user => user.id === req.user.id)) {
        throw new NotFoundException(`Game history not found`);
      }
      return res.status(200).json(gameHistory);
    }
    catch {
      return res.status(404).json({ error: 'Game history not found' });
    }
  }
}
