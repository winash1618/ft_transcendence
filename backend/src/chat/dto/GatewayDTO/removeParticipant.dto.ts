import { IsString, IsNotEmpty } from 'class-validator';

export class RemoveParticipantDTO {
  @IsString()
  @IsNotEmpty()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  userID: string;
}
