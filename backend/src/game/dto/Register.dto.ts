import { IsBoolean } from 'class-validator';

export class RegisterDto {
  @IsBoolean()
  hasMiddleWall: boolean;
}
