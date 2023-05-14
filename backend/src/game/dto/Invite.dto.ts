import { IsString, IsNotEmpty } from 'class-validator';

export class InviteDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
