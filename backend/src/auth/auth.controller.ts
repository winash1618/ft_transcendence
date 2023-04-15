import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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

  @UseGuards(FtAuthGuard)
  @Get()
  async redirectUri(@Req() req, @Res() res: Response) {
    const token = await this.authService.getLongExpiryJwtToken(
      req.user as User,
    );
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(process.env.FRONTEND_BASE_URL);
  }

  @UseGuards(FtAuthGuard)
  @Get('42/login')
  handleLogin() {
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('auth');
    return res
	.status(HttpStatus.OK)
	.json({ message: 'logged out successfully' });
  }

  @Get('guest')
  async guestLogin(@Res() res: Response) {
    const user = await this.userService.findOne('user1');
    const token = await this.authService.getLongExpiryJwtToken(user);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(process.env.FRONTEND_BASE_URL);
  }

  @Get('token')
  async GetAuth(@Req() req, @Res() res: Response): Promise<Response> {
    const cookie = req.cookies.auth;
    try {
      if (!cookie) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }

      const verifyToken = await this.authService.verifyToken(cookie);

      if (!verifyToken) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }

      const cookieToken = await this.authService.decodeToken(cookie);

      if (!cookieToken) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }
      const user = await this.authService.validateUser(cookieToken as User);
      const token: string = await this.authService.getJwtToken(user);

      const secretData = {
        token,
        user,
      };
      return res.status(HttpStatus.ACCEPTED).json(secretData);
    } catch (e) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }
  }
}
