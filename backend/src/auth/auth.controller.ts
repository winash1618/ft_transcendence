import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './ft_auth/ft-auth.guard';
import { FortyTwoStrategy } from './ft_auth/ft.strategy';

@Controller()
export class AuthController {
  constructor(
    private FortyTwoStrategy: FortyTwoStrategy,
    private readonly authService: AuthService) {}

  @Get('login')
  getHello(@Req() req, @Res() res): string {
    console.log("Hello");
    return this.authService.getHello();
  }

  @Get('42')
  @UseGuards(FortyTwoAuthGuard)
  async fortyTwoLogin(@Req() req, @Res() res) {
  }
}
