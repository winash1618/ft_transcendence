import { IsString, IsNotEmpty, IsUUID, IsBoolean, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { KeyPress } from '../interface/game.interface';

class KeyDto {
  @IsBoolean()
  upKey: boolean;

  @IsBoolean()
  downKey: boolean;
}

export class MoveDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  roomID: string;

  @IsObject()
  @ValidateNested()
  @Type(() => KeyDto)
  key: KeyDto;

  @IsBoolean()
  isPressed: boolean;
}
