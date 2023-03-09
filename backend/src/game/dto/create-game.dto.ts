import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateGameDto {
	
	@IsNumber()
	@ApiProperty()
	ballX1: number;

	@IsNumber()
	@ApiProperty()
	ballY1: number;

	@IsNumber()
	@ApiProperty()
	ballX2: number;

	@IsNumber()
	@ApiProperty()
	ballY2: number;

	@ApiProperty()
	isPaused: boolean;

	@IsNumber()
	@ApiProperty()
	map: number;

	@IsNumber()
	@ApiProperty()
	player1Score: number;

	@IsNumber()
	@ApiProperty()
	player2Score: number;

	@IsNumber()
	@ApiProperty()
	side1: number;

	@IsNumber()
	@ApiProperty()
	status: number;

	@IsNumber()
	@ApiProperty()
	side2: number;

	@IsNumber()
	@ApiProperty()
	playerId:  number | null;

	@IsNumber()
	@ApiProperty()
	gameRoomId: number | null;

	
}
