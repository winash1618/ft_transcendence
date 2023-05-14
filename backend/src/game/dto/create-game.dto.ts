import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @ApiProperty()
  @IsUUID()
  player_one: string;

  @IsString()
  @ApiProperty()
  @IsUUID()
  player_two: string;

  @IsString()
  @ApiProperty()
  hasMiddleWall: boolean;

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
