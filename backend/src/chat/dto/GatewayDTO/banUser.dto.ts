import { IsString, IsNotEmpty } from 'class-validator';

export class BanUserDTO {
  @IsString()
  @IsNotEmpty()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  userID: string;
}
