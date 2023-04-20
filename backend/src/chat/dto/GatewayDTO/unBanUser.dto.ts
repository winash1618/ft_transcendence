import { IsString, IsNotEmpty } from 'class-validator';

export class UnBanUserDTO {
  @IsString()
  @IsNotEmpty()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  userID: string;
}
