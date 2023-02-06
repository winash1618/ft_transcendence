import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { FortyTwoStrategy } from './ft_auth/ft.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, FortyTwoStrategy],
})
export class AuthModule {}
