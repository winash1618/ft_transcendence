import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from './interface/auth';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from '@prisma/client';
import moment from 'moment';

@Injectable()
export class AuthService implements IAuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UsersService
	) { }

	getHello(): string {
		return 'Hello World!';
	}

	async validateUser(userDto: CreateUserDto): Promise<User> {
		let user = await this.userService.findOne(userDto.login);
		if (!user) {
			user = await this.userService.add42User(userDto);
		}
		return user;
	}

	async getJwtToken(user): Promise<string> {
		const payload = {
			id: user.id,
			login: user.login,
		}
		return this.jwtService.sign(payload);
	}

	public async decodeToken(token: string): Promise<any> {
		return this.jwtService.decode(token);
	}

	public async verifyToken(token: string): Promise<any> {
		return this.jwtService.verify(token);
	}

	public async validRefreshToken(login: string, pass: string): Promise<User> {
		const currentDate = Date.now();
		const user = await this.userService.findOne(login);
		if (!user) {
			return null;
		}
		let currentUser = {
			...user,
		}
		return currentUser;
	}
}
