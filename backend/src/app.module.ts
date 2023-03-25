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
import { MessagesGateway } from './messages/messages.gateway';

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
	providers: [MessagesGateway],
})
export class AppModule { }
