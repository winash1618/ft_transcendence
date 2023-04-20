import { IsString, IsNotEmpty } from 'class-validator';

export class AddPasswordDTO {
  @IsString()
  @IsNotEmpty()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
