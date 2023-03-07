import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { CreateGameDto } from "src/game/dto/create-game.dto";

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  login: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  first_name: string;

  @IsString()
  @ApiProperty()
  last_name: string;

  @IsString()
  @ApiProperty()
  refreshToken?: string;

  @IsString()
  @ApiProperty()
  refreshTokenExp?: number;
}
