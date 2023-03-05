import { Controller, Get, HttpStatus, Query, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { FtAuthGuard } from 'src/utils/guards/ft.guard';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    ) {}

  @Get('hello')
  async helloWorld() {
    return this.authService.getHello();
  }

  @Get()
  @UseGuards(FtAuthGuard)
  async redirectUri(@Req() req, @Res() res: Response) {
    const  token = await this.authService.getJwtToken(req.user as User);
    const refreshToken = await this.authService.getRefreshToken(req.user as User);

    const secretData = {
      token,
      refreshToken,
    }
    res.cookie('auth-cookie', secretData, { httpOnly: true });
    return res.redirect('http://localhost:3001/hello');
  }

  @UseGuards(FtAuthGuard)
  @Get('42/login')
  handleLogin() {
    return ;
  }
}
