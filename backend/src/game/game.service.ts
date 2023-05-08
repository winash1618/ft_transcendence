import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameHistory } from '@prisma/client';
import { GameStatus } from './interface/game.interface';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGameDto: CreateGameDto) {
    return await this.prisma.gameHistory.create({
      data: {
        player_one: createGameDto.player_one,
        player_two: createGameDto.player_two,
        player_score: -1,
        opponent_score: -1,
        winner: '',
        looser: '',
      }
    });
  }

  async storeGameHistory(gameData: CreateGameDto, id: string): Promise<void> {
    gameData.winner =
      gameData.player_score > gameData.opponent_score
        ? gameData.player_one
        : gameData.player_two;
    gameData.looser =
      gameData.player_score < gameData.opponent_score
        ? gameData.player_one
        : gameData.player_two;

    await this.prisma.gameHistory.update({
      where: {
        id: id,
      },
      data: {
        player_one: gameData.player_one,
        player_two: gameData.player_two,
        player_score: gameData.player_score,
        opponent_score: gameData.opponent_score,
        winner: gameData.winner,
        looser: gameData.looser,
      }
    });
  }

  async getGameHistory(playerId: string) {
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
      select: {
        player_one: true,
        player_two: true,
        player_score: true,
        opponent_score: true,
        winner: true,
        looser: true,
        playerOne: {
          select: {
            username: true,
            profile_picture: true,
          },
        },
        playerTwo: {
          select: {
            username: true,
            profile_picture: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!gameHistory) {
      throw new Error('No game history found');
    }

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

  async createGameRoom(player1ID: string, player2ID: string) {
    const gameRoom = await this.prisma.gameHistory.create({
      data: {
        player_one: player1ID,
        player_two: player2ID,
        player_score: 0,
        opponent_score: 0,
        winner: null,
        looser: null,
      },
    });

    return gameRoom;
  }

  async checkGameRoomExists(roomID: string) {
    const gameRoom = await this.prisma.gameHistory.findUnique({
      where: {
        id: roomID,
      },
    });

    if (!gameRoom) {
      throw new Error('Game room does not exist');
    }

    return gameRoom;
  }

  async getGame(id: string) {
    const game = await this.prisma.gameHistory.findUnique({
      where: {
        id,
      },
    });

    if (!game) {
      throw new Error('Game not found');
    }

    if (game.winner === '' || game.winner === null)
      return game.id;

    return '';
  }

  async updateUserAchievements(userId: string) {
    const gameHistory = await this.prisma.gameHistory.findMany({
      where: {
        OR: [
          { player_one: userId },
          { player_two: userId },
        ],
      },
    });

    // Calculate the number of games won
    const gamesWon = gameHistory.filter((game) => (game.winner === userId)).length;

    // Check if user has won three or ten games
    const hasWonThree = gamesWon >= 3;
    const hasWonTen = gamesWon >= 10;

    // Update user achievements
    const ach = await this.prisma.achievements.update({
      where: {
        userID: userId,
      },
      data: {
        played_first: {
          set: true,
        },
        won_three: {
          set: hasWonThree,
        },
        won_ten: {
          set: hasWonTen,
        },
      },
    });

    return ach;
  }
}
