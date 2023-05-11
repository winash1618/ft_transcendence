import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class RejectDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  inviteID: string;
}
