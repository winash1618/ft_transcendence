import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class joinConversationDto {
  @IsString()
  @IsNotEmpty()
  conversationID: string;

  @IsOptional()
  @IsString()
  password: string;
}
