import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class sendMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  conversationID: string;
}
