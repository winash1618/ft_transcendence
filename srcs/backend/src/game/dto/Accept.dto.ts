import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class AcceptDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  inviteID: string;
}
