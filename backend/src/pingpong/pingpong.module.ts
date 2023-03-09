import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { WsJwtStrategy } from 'src/auth/Strategy/Jwt/ws-jwt.strategy';
import { PrismaModule } from 'src/database/prisma.module';
import { PrismaService } from 'src/database/prisma.service';
import { UsersModule } from 'src/users/users.module';
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
