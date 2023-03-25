import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
// import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GatewaySessionManager } from './gateway.session';
import { ConversationModule } from 'src/conversation/conversation.module';
import { MessageModule } from 'src/message/message.module';
import { ParticipantModule } from 'src/participant/participant.module';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageService } from 'src/message/message.service';
import { ParticipantService } from 'src/participant/participant.service';

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
    ConversationModule,
    MessageModule,
    ParticipantModule
  ],
  providers: [
    GatewaySessionManager,
    // ChatGateway,
    ChatService,
    UsersService,
    ConversationService,
    MessageService,
    ParticipantService,
    PrismaService],
})
export class ChatModule {}
