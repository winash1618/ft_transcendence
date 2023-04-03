import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateParticipantDto {
  @IsString()
  @ApiProperty()
  user_id: string;

  @IsString()
  @ApiProperty()
  conversation_id: string;

  @IsString()
  @ApiProperty()
  role?: string;

  @IsString()
  @ApiProperty()
  conversation_status?: string;
}

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {}
