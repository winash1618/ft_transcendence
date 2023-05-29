import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class AddParticipantDTO {
  @IsString()
  @IsNotEmpty()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userID: string;
}
