import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class MuteUserDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userID: string;
}
