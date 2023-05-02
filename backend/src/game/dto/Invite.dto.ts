import { IsString, IsNotEmpty } from 'class-validator';

export class InviteDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
