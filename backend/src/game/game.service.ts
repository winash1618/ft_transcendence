import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameHistory } from '@prisma/client';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async storeGameHistory(gameData: CreateGameDto): Promise<void> {
    gameData.winner =
      gameData.player_score > gameData.opponent_score
        ? gameData.player_one
        : gameData.player_two;
    gameData.looser =
      gameData.player_score < gameData.opponent_score
        ? gameData.player_one
        : gameData.player_two;

    await this.prisma.gameHistory.create({
      data: gameData,
    });
  }

  async getGameHistory(playerId: string): Promise<GameHistory[]> {
    const gameHistory = await this.prisma.gameHistory.findMany({
      where: {
        OR: [
          {
            player_one: playerId,
          },
          {
            player_two: playerId,
          },
        ],
      },
    });
    return gameHistory;
  }

  async updateGameHistory(
    id: string,
    updateGameDto: UpdateGameDto,
  ): Promise<GameHistory> {
    const gameHistory = await this.prisma.gameHistory.update({
      where: {
        id,
      },
      data: updateGameDto,
    });
    return gameHistory;
  }

  async updatePlayerHistory(
    id: string,
    updateGameDto: UpdateGameDto,
  ): Promise<GameHistory> {
    const gameHistory = await this.prisma.gameHistory.update({
      where: {
        id,
      },
      data: updateGameDto,
    });
    return gameHistory;
  }
}
