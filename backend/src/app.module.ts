import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { PrismaModule } from './database/prisma.module';
import { PingpongGateway } from './pingpong/pingpong.gateway';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService, PingpongGateway]
})
export class AppModule {}
