import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { FortyTwoStrategy } from './Strategy/FortyTwoAPI/ft.strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/database/prisma.module';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './Strategy/Jwt/jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WsJwtStrategy } from './Strategy/ws-jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [
    UsersService,
    AuthService,
    FortyTwoStrategy,
    JwtStrategy,
    WsJwtStrategy,
  ],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
