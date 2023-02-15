import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { FortyTwoStrategy } from './FortyTwoAPI/ft.strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/database/prisma.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule ,PassportModule, PrismaModule],
  providers: [ AuthService, FortyTwoStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
