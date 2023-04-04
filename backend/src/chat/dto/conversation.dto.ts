import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { PartialType } from '@nestjs/swagger';

export class CreateConversationDto {
  @IsString()
  @ApiProperty()
  title?: string;

  @IsString()
  @ApiProperty()
  password?: string;

  @IsString()
  @ApiProperty()
  privacy?: string;
}

export class UpdateConversationDto extends PartialType(CreateConversationDto) {}
