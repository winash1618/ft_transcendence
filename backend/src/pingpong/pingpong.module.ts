import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PingpongGateway } from './pingpong.gateway';
import { PingpongService } from './pingpong.service';
import { PrismaService } from 'src/database/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.getOrThrow('JWT_SECRET'),
				signOptions: {
					expiresIn: configService.getOrThrow('JWT_EXPIRES_IN')
				}
			})
		})
	],
	providers: [PingpongService, PingpongGateway, JwtService]
})
export class PingpongModule { }
