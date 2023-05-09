import {
  IsString,
  IsNotEmpty,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { InviteType } from '@prisma/client';

export class GetProfilePhotoDto {
  @IsString()
  filename: string;

  @IsString()
  token: string;
}

export class createInviteDto {
  @IsString()
  @IsNotEmpty()
  type: InviteType;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  receiverId: string;
}

export class UpdateUserNameDto {
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  name: string;
}
