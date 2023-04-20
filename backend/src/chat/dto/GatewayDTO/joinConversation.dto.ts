import { IsString, IsNotEmpty } from 'class-validator';

export class joinConversationDto {
  @IsString()
  @IsNotEmpty()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsString()
  @IsNotEmpty()
  privacy: string;
}
