import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/database/prisma.module';
import { GameController } from './game.controller';
import { UsersService } from 'src/users/users.service';
import { GatewaySessionManager } from './game.session';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_EXPIRES_IN'),
        },
      }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
  ],
  providers: [GameGateway, GameService, UsersService, GatewaySessionManager],
  controllers: [GameController],
})
export class GameModule {}
