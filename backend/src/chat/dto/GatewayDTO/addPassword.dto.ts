import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class AddPasswordDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
