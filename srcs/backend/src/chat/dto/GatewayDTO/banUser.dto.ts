import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class BanUserDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userID: string;
}
