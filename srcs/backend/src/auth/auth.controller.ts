import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { User, UserStatus } from '@prisma/client';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { FtAuthGuard } from 'src/utils/guards/ft.guard';
import { JwtAuthGuard } from 'src/utils/guards/jwt.guard';
import { AuthService } from './auth.service';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { ConfigService } from '@nestjs/config';
import { SearchUserDto, ValidateOtpDto, VerifyOtpDto } from './authDTO/2auth.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private configService: ConfigService
  ) {}

  @Get('hello')
  async helloWorld() {
    return this.authService.getHello();
  }

  @UseGuards(FtAuthGuard)
  @Get()
  async redirectUri(@Req() req, @Res() res: Response) {
    try {
      if (!req.user) {
        return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
      }
      await this.userService.updateAuthentication(req.user.id, false);
      const token = await this.authService.getLongExpiryJwtToken(
        req.user as User,
      );
      console.log('User: ', token);
      await this.userService.userStatusUpdate(req.user.id, UserStatus.ONLINE);

      res.cookie('auth', token, { httpOnly: true });
      return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
    } catch (err) {
      console.log(err);
    }
  }

  @UseGuards(FtAuthGuard)
  @Get('42/login')
  async handleLogin() {
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req, @Res() res: Response) {
    try {
      res.clearCookie('auth');
      await this.userService.userStatusUpdate(req.user.id, 'OFFLINE');
      return res
        .status(HttpStatus.OK)
        .json({ message: 'logged out successfully' });
    } catch (err) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'failed to logout' });
    }
  }

  @Get('guest')
  async guestLogin(@Res() res: Response) {
    const user = await this.userService.findOne('user1');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log('User1: ', token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }

  @Get('guest2')
  async guestLogin2(@Res() res: Response) {
    const user = await this.userService.findOne('user2');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log('User2: ', token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
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

  @UseGuards(JwtAuthGuard)
  @Get('generate')
  async generate2FASecret(@Res() res: Response): Promise<Response> {
    const secret = speakeasy.generateSecret({
      length: 15,
      name: 'ft_transcendence',
    });
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    return res
      .status(HttpStatus.ACCEPTED)
      .json({ secret: secret.base32, qrCode });
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-otp')
  async verifyOTP(
    @Req() req,
    @Res() res: Response,
    @Body() body: VerifyOtpDto,
  ): Promise<Response> {
    const verified = speakeasy.totp.verify({
      secret: body.secret,
      encoding: 'base32',
      token: body.otp,
      window: 1,
    });

    if (verified) {
      const user = await this.userService.updateSecretCode(
        req.user.id,
        body.secret,
      );
      return res.status(HttpStatus.ACCEPTED).json({ user });
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'otp is invalid' });
    }
  }

  @Post('validate-otp')
  async validateOTP(
    @Req() req,
    @Res() res: Response,
    @Body() body: ValidateOtpDto,
  ): Promise<Response> {
    const cookie = req.cookies.auth;
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
    const user = await this.authService.validateUserTwo(cookieToken as User);

    const verified = speakeasy.totp.verify({
      secret: user.Twofa_secret,
      encoding: 'base32',
      token: body.otp,
      window: 1,
    });

    if (verified) {
      await this.userService.updateAuthentication(user.id, true);
      return res.status(HttpStatus.ACCEPTED).json({ message: 'otp is valid' });
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'otp is invalid' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('disable-2fa')
  async disable2FA(@Req() req, @Res() res: Response): Promise<Response> {
    try {
      const user = await this.userService.updateSecretCode(req.user.id, null);
      return res.status(HttpStatus.ACCEPTED).json({ user });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/search')
  @UsePipes(new ValidationPipe())
  async searchUsers(
    @Query() searchUserDto: SearchUserDto,
  ) {
    const { search } = searchUserDto;
    return await this.userService.searchUsers(search);
  }
}
