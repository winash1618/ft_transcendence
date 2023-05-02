import { IsString, IsNotEmpty } from 'class-validator';
import { KeyPress } from '../interface/game.interface';

export class MoveDto {
  @IsString()
  @IsNotEmpty()
  roomID: string;

  @IsString()
  @IsNotEmpty()
  key: KeyPress;

  @IsString()
  @IsNotEmpty()
  isPressed: string;
}
