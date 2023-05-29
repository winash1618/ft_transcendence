import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  author_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  conversation_id: string;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
