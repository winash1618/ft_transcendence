import { IsString, IsNotEmpty } from 'class-validator';

export class AddParticipantDTO {
  @IsString()
  @IsNotEmpty()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  userID: string;
}
