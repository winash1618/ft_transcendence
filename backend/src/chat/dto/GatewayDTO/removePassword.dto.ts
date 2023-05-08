import { IsString, IsNotEmpty } from 'class-validator';

export class RemovePasswordDTO {
  @IsString()
  @IsNotEmpty()
  conversationID: string;
}
