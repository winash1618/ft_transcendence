import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class KickUserDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userID: string;
}
