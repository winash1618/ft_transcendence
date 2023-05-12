import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { KeyPress } from '../interface/game.interface';

export class MoveDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  roomID: string;

  @IsString()
  @IsNotEmpty()
  key: KeyPress;

  @IsString()
  @IsNotEmpty()
  isPressed: string;
}
