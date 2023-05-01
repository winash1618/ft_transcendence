import { Privacy } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsIn,
  Matches,
  IsOptional,
  Length,
} from 'class-validator';

export class createConversationDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @Length(1, 255) // Title length should be between 1 and 255 characters
  title: string;

  @IsOptional()
  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character',
  })
  password?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([Privacy.PUBLIC, Privacy.PRIVATE, Privacy.PROTECTED]) // Privacy must be one of the specified values
  privacy: string;
}
