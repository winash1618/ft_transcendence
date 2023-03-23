import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";


export class CreateStatDto {
	@ApiProperty()
	@IsNumber()
	userId: number;

	@ApiProperty()
	@IsNumber()
	opponentId: number;

	@ApiProperty()
	@IsNumber()
	userScore: number;

	@ApiProperty()
	@IsNumber()
	opponentScore: number;
}