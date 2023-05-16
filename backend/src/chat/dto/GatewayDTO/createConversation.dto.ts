import { Privacy } from '@prisma/client';
import { IsNotEmpty, IsString, IsIn, Length, Matches } from 'class-validator';
import { IsOptionalOrMatchesRegex } from 'src/utils/validator';

export class createConversationDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @Length(1, 50) // Title length should be between 1 and 50 characters
  @Matches(/^[a-zA-Z0-9]*$/, { message: 'Title can only contain alphanumeric characters' })
  title: string;

  @IsOptionalOrMatchesRegex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character',
    },
  )
  password?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([Privacy.PUBLIC, Privacy.PRIVATE, Privacy.PROTECTED]) // Privacy must be one of the specified values
  privacy: string;
}
