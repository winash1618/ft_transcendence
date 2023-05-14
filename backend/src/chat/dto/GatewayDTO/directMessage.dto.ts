import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class DirectMessageDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userID: string;
}
