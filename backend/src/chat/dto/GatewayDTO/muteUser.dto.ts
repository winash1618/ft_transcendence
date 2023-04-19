import { IsString, IsNotEmpty } from 'class-validator';

export class MuteUserDTO {
  @IsString()
  @IsNotEmpty()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  userID: string;
}
