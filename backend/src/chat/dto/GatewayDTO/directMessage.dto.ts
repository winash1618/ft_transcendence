import { IsString, IsNotEmpty } from 'class-validator';

export class DirectMessageDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  userID: string;
}
