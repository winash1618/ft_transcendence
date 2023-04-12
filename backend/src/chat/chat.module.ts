import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GatewaySessionManager } from './gateway.session';
import { a_ConversationService } from 'src/chat/Queries/a_conversation.service';
import { MessageService } from 'src/chat/Queries/message.service';
import { a_ParticipantService } from 'src/chat/Queries/a_participant.service';
import { ConversationService } from './Queries/conversation.service';
import { ParticipantService } from './Queries/participant.service';
import { ChatController } from './chat.controller';

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
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [
    GatewaySessionManager,
    ChatGateway,
    ChatService,
    UsersService,
    a_ConversationService,
    a_ParticipantService,
    ConversationService,
    MessageService,
    ParticipantService,
    PrismaService],
  controllers: [ChatController],
})
export class ChatModule {}
