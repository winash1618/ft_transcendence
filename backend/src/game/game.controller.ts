import {
  Controller, Get, Param,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('history/:id')
  async getGameHistory(@Param('id') id: string) {
    const gameHistory = await this.gameService.getGameHistory(id);
    return gameHistory;
  }

}
