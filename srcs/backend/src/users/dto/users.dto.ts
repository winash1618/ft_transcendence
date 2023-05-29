import {
  IsString,
  IsNotEmpty,
  IsUUID,
  MinLength,
  MaxLength,
  IsIn,
  Matches
} from 'class-validator';
import { InviteType } from '@prisma/client';

export class GetProfilePhotoDto {
  @IsString()
  filename: string;

  @IsString()
  token: string;
}

export class createInviteDto {
  @IsIn([InviteType.GAME, InviteType.FRIEND])
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

export class UpdateNameDto {
  @IsString()
  @Matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{4,8}$/, {
    message: 'Nickname must be 4-8 characters and can only contain a mix of a-z, A-Z, 0-9, _ and -',
  })
  name: string;
}
