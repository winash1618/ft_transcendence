import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { WsJwtStrategy } from 'src/auth/Strategy/Jwt/ws-jwt.strategy';
import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from 'src/users/users.service';
import { PingpongGateway } from './pingpong.gateway';
import { PingpongService } from './pingpong.service';

@Module({
	imports: [
		AuthModule,
	],
	providers: [PingpongService, PingpongGateway, JwtService, AuthService, UsersService, PrismaService],
})
export class PingpongModule { }
