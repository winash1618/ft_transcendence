import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateGameDto {
	
	@IsNumber()
	@ApiProperty()
	ballX: number;

	@IsNumber()
	@ApiProperty()
	ballY: number;

	@ApiProperty()
	isPaused: boolean;

	@IsNumber()
	@ApiProperty()
	map: number;

	@IsNumber()
	@ApiProperty()
	score: number;

	@IsNumber()
	@ApiProperty()
	side: number;

	@IsNumber()
	@ApiProperty()
	status: number;

	
}
