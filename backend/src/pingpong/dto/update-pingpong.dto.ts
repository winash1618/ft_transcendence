import { PartialType } from '@nestjs/swagger';
import { CreatePingpongDto } from './create-pingpong.dto';

export class UpdatePingpongDto extends PartialType(CreatePingpongDto) {}
