import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './database/prisma.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule, PrismaModule, GameModule],
})
export class AppModule {}
