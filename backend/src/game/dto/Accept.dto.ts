import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class AcceptDto {
  @IsString()
  @IsNotEmpty()
  inviteID: string;

  @IsString()
  @IsNotEmpty()
  @IsBoolean()
  hasMiddleWall: boolean;
}
