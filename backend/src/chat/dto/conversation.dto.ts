import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Privacy } from '@prisma/client';

export class CreateConversationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  creator_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password?: string;

  @ApiProperty()
  @IsNotEmpty()
  privacy?: string;
}

export class UpdateConversationDto extends PartialType(CreateConversationDto) {}
