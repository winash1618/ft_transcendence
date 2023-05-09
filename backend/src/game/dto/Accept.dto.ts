import { IsString, IsNotEmpty } from 'class-validator';

export class AcceptDto {
  @IsString()
  @IsNotEmpty()
  inviteID: string;
}
