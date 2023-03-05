import { Controller, Get, HttpStatus, Query, Req, Res, UseGuards } from '@nestjs/common';
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
    const user = await this.userService.findOne(req.user.email);

    const token = await this.authService.getJwt(user);

    res.cookie('access_token', token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });
    res.status(HttpStatus.OK);
    return res.redirect('http://localhost:3000/hello');
  }

  @UseGuards(FtAuthGuard)
  @Get('42/login')
  handleLogin() {
    return ;
  }
}
