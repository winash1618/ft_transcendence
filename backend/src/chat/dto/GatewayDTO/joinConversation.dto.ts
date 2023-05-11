import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class joinConversationDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  conversationID: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  password: string;
}
