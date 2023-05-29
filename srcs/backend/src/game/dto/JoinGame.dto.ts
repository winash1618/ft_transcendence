import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class JoinGameDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  roomID: string;
}
