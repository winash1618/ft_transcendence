

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'wsjwt') {
	constructor(
		private readonly usersService: UsersService,
		private configService: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				WsJwtStrategy.extractJWT,
			]),
			secretOrKey: configService.get<string>('JWT_SECRET'),
		});
	}

	private static extractJWT(req: Request): string | null {
		if (
			req.cookies &&
			'auth' in req.cookies &&
			req.cookies.auth.length > 0
		) {
			return req.cookies.token;
		}
		return null;
	}

	async validate(payload: any) {
		const { email } = payload;
		const user = await this.usersService.findOne(email);
		if (!user) {
			throw new WsException('Unauthorized access');
		}
		return user;
	}
}