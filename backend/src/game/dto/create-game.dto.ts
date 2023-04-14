import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @ApiProperty()
  player_one: string;

  @IsString()
  @ApiProperty()
  player_two: string;

  @IsNumber()
  @ApiProperty()
  player_score: number;

  @IsNumber()
  @ApiProperty()
  opponent_score: number;

  @IsString()
  @ApiProperty()
  winner: string;

  @IsString()
  @ApiProperty()
  looser: string;
}
