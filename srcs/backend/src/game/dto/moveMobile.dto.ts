import { IsString, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';
import { KeyPress } from '../interface/game.interface';

export class MoveMobileDto {
  @IsUUID()
  @IsNotEmpty()
  roomID: string;

  @IsNumber()
  key: KeyPress;
}
