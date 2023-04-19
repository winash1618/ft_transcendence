import { IsNotEmpty, IsString } from "class-validator";

export class KickUserDTO {
  @IsString()
  @IsNotEmpty()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  userID: string;
}
