import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot() ,AuthModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AppModule {}
