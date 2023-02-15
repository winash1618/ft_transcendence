import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService]
})
export class AppModule {}
