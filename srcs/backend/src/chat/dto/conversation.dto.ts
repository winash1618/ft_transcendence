import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
