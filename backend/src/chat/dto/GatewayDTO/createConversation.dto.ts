import { IsNotEmpty, IsString } from "class-validator";

export class createConversationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsString()
  @IsNotEmpty()
  privacy: string;
}
