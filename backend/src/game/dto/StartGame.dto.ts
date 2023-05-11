import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class StartGameDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  roomID: string;

  @IsString()
  @IsNotEmpty()
  hasMiddleWall: boolean;
}
