import { Module } from '@nestjs/common';
import { GameRoomService } from './game-room.service';
import { GameRoomController } from './game-room.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
	controllers: [GameRoomController],
	providers: [GameRoomService],
	imports: [PrismaModule],
})
export class GameRoomModule { }
