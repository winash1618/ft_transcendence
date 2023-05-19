import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class StartGameDto {
  @IsUUID()
  @IsNotEmpty()
  roomID: string;
}
