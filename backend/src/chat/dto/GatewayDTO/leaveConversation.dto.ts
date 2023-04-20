import { IsString, IsNotEmpty } from 'class-validator';

export class LeaveConversationDTO {
  @IsString()
  @IsNotEmpty()
  conversationID: string;
}
