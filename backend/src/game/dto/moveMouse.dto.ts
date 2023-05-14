import { IsString, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class MoveMouseDto {
  @IsUUID()
  @IsNotEmpty()
  roomID: string;

  @IsNumber()
  y: number;
}
