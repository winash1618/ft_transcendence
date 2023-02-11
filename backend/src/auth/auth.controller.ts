import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(@Query('code') code: string): string {
    console.log(code);
    this.authService.fetchToken(code);
    return this.authService.getHello();
  }

  @UseGuards(AuthGuard('42'))
  @Get('42/login')
  handleLogin() {
    return ;
  }
}
