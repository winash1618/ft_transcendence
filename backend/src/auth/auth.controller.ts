import { Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { FtAuthGuard } from 'src/utils/guards/ft.guard';
import { JwtAuthGuard } from 'src/utils/guards/jwt.guard';
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

  @Get('test')
  @UseGuards(JwtAuthGuard)
  async testing() {
    return 'testing this';
  }

  @Get()
  @UseGuards(FtAuthGuard)
  async redirectUri(@Req() req, @Res() res: Response) {
    const  token = await this.authService.getJwtToken(req.user as User);

    const secretData = {
      token,
    }
    res.cookie('auth-cookie', secretData, { httpOnly: true });
    return res.redirect('http://localhost:3000');
  }

  @UseGuards(FtAuthGuard)
  @Get('42/login')
  handleLogin() {
    return ;
  }

  @Get('token')
  async GetAuth(
      @Req() req,
      @Res() res: Response,
  ): Promise<Response> {
      const user = await this.authService.validateUser(req.user as User);

      const token: string = await this.authService.getJwtToken(user);

      const secretData = {
        token,
		user,
      }

      return res.status(HttpStatus.ACCEPTED).json(secretData);
  }
}
