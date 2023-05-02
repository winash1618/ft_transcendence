import { IsString, IsNotEmpty } from 'class-validator';

export class StartGameDto {
  @IsString()
  @IsNotEmpty()
  roomID: string;

  @IsString()
  @IsNotEmpty()
  hasMiddleWall: boolean
}
