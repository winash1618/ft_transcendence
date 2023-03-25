import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateConversationDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  creator_id: string;

  @IsString()
  @ApiProperty()
  channel_id: string;

  @IsString()
  @ApiProperty()
  password?: string;

  @IsString()
  @ApiProperty()
  privacy?: string;
}
