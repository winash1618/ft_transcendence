import { IsString, IsNotEmpty } from 'class-validator';

export class MakeAdminDTO {
  @IsString()
  @IsNotEmpty()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  userID: string;
}
