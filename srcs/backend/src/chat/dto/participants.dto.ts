import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsString, IsUUID } from 'class-validator';

export class CreateParticipantDto {
  @IsString()
  @ApiProperty()
  @IsUUID()
  user_id: string;

  @IsString()
  @ApiProperty()
  @IsUUID()
  conversation_id: string;

  @ApiProperty()
  role?: Role;

  @IsString()
  @ApiProperty()
  conversation_status?: string;
}

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {}
