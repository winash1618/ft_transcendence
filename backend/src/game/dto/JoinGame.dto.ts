import { IsString, IsNotEmpty } from 'class-validator';

export class JoinGameDto {
  @IsString()
  @IsNotEmpty()
  roomID: string;
}
