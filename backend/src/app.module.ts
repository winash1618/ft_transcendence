import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './database/prisma.module';
import { ChatModule } from './chat/chat.module';
import { ConversationModule } from './conversation/conversation.module';
import { ParticipantModule } from './participant/participant.module';
import { MessageModule } from './message/message.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule, UsersModule,
    PrismaModule,
    ChatModule,
    ConversationModule,
    MessageModule,
    ParticipantModule,
    GameModule
  ],
})
export class AppModule { }
