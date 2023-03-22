import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './database/prisma.module';
import { ChatModule } from './chat/chat.module';
import { PingpongModule } from './pingpong/pingpong.module';
import { GameModule } from './game/game.module';
import { GameRoomModule } from './game-room/game-room.module';
import { StatsModule } from './stats/stats.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		AuthModule, UsersModule,
		PrismaModule,
		ChatModule,
		PingpongModule,
		GameModule,
		GameRoomModule,
		StatsModule
	],
})
export class AppModule { }
