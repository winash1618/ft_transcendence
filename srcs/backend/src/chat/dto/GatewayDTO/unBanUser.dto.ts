import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class UnBanUserDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userID: string;
}
