import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class MoveMouseDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  roomID: string;

  @IsString()
  @IsNotEmpty()
  y: string;
}
