import {
  Controller,
  Get,
  ParseUUIDPipe,
  NotFoundException,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt.guard';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('history/:userID')
  async getGameHistory(
    @Req() req,
    @Param('userID', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    try {
      if (req.user.id !== id) throw new NotFoundException(`Game history not found`);
      const gameHistory = await this.gameService.getGameHistory(id);
      return res.status(200).json(gameHistory);
    } catch {
      return res.status(404).json({ error: 'Game history not found' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userID')
  async getGame(
    @Param('userID', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    try {
      const game = await this.gameService.getGame(id);
      if (!game)
        throw new NotFoundException(`Game is finished`);
      return res.status(200).json(game);
    } catch {
      return res.status(404).json({ error: 'Game not found' });
    }
  }
}
