import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { FortyTwoStrategy } from './FortyTwoAPI/ft.strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/database/prisma.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [UsersModule ,PassportModule, PrismaModule],
  providers: [UsersService, AuthService, FortyTwoStrategy],
})
export class AuthModule {}
