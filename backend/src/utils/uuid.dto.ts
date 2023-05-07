import { IsUUID, IsString, Length } from 'class-validator';

export class ConversationIdDto {
  @IsUUID()
  conversationID: string;
}

export class UserIDDto {
  @IsUUID()
  userID: string;
}

export class FriendDto {
  @IsUUID()
  userID: string;

  @IsUUID()
  friendID: string;
}

export class BlockDto {
  @IsUUID()
  userID: string;

  @IsUUID()
  blockID: string;
}

export class loginDto {
  @IsString()
  @Length(4, 20)
  username: string;
}
