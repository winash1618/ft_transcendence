import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Privacy } from "@prisma/client";
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

  @ApiProperty()
  privacy?: Privacy;
}
