import { IsString, IsNotEmpty } from 'class-validator';

export class MoveMouseDto {
  @IsString()
  @IsNotEmpty()
  roomID: string;

  @IsString()
  @IsNotEmpty()
  y: string;
}
