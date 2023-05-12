import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class RemovePasswordDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  conversationID: string;
}
