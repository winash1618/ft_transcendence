import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateGameDto {
	@IsNumber()
	@ApiProperty()
	gameInfoId: number;

	@IsNumber()
	@ApiProperty()
	player1Id: number;

	@IsNumber()
	@ApiProperty()
	player2Id: number;

	@IsNumber()
	@ApiProperty()
	winnerId: number;
}
