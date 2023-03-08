import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { CreatePingpongDto } from './dto/create-pingpong.dto';
import { UpdatePingpongDto } from './dto/update-pingpong.dto';

@Injectable()
export class PingpongService {
	constructor(
		private readonly jwtService: JwtService,
	) { }

	verifyToken(token: string) {
		return this.jwtService.verify(token);
	}
	create(createPingpongDto: CreatePingpongDto) {
		return 'This action adds a new pingpong';
	}

	findAll() {
		return `This action returns all pingpong`;
	}

	findOne(id: number) {
		return `This action returns a #${id} pingpong`;
	}

	update(id: number, updatePingpongDto: UpdatePingpongDto) {
		return `This action updates a #${id} pingpong`;
	}

	remove(id: number) {
		return `This action removes a #${id} pingpong`;
	}
}
