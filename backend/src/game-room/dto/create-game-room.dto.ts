import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateGameRoomDto {
	@IsString()
	@ApiProperty()
	roomName: string;
}
