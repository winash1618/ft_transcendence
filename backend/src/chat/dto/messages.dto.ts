import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  author_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  conversation_id: string;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
