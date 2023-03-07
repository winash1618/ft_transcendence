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
	  user: req.user,
    }
    res.cookie('auth-cookie', secretData, { httpOnly: true });
    return res.redirect(process.env.FRONTEND_BASE_URL);
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
		const cookie = req.cookies.auth;
		
		if (!cookie) {
			return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
		}
      const user = await this.authService.validateUser(req.cookies.auth.user as User);
      const token: string = await this.authService.getJwtToken(user);

      const secretData = {
        token,
		user,
      }

      return res.status(HttpStatus.ACCEPTED).json(secretData);
  }
}
