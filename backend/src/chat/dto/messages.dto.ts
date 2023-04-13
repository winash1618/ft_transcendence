import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @ApiProperty()
  message: string;

  @IsString()
  @ApiProperty()
  author_id: string;

  @IsString()
  @ApiProperty()
  conversation_id: string;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
