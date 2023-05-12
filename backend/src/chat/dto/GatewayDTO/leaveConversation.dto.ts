import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class LeaveConversationDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  conversationID: string;
}
