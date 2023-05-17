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
import { ValidateOtpDto, VerifyOtpDto } from './authDTO/2auth.dto';

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
        return res.redirect('/42/login');
      }
      await this.userService.updateAuthentication(req.user.id, false);
      const token = await this.authService.getLongExpiryJwtToken(
        req.user as User,
      );
      console.log(token);
      this.userService.userStatusUpdate(req.user.id, UserStatus.ONLINE);

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
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest2')
  async guest2Login(@Res() res: Response) {
    const user = await this.userService.findOne('user2');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest3')
  async guest3Login(@Res() res: Response) {
    const user = await this.userService.findOne('user3');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest4')
  async guest4Login(@Res() res: Response) {
    const user = await this.userService.findOne('user4');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest5')
  async guest5Login(@Res() res: Response) {
    const user = await this.userService.findOne('user5');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest6')
  async guest6Login(@Res() res: Response) {
    const user = await this.userService.findOne('user6');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest7')
  async guest7Login(@Res() res: Response) {
    const user = await this.userService.findOne('user7');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest8')
  async guest8Login(@Res() res: Response) {
    const user = await this.userService.findOne('user8');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest9')
  async guest9Login(@Res() res: Response) {
    const user = await this.userService.findOne('user9');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest10')
  async guest10Login(@Res() res: Response) {
    const user = await this.userService.findOne('user10');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest11')
  async guest11Login(@Res() res: Response) {
    const user = await this.userService.findOne('user11');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest12')
  async guest12Login(@Res() res: Response) {
    const user = await this.userService.findOne('user12');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest13')
  async guest13Login(@Res() res: Response) {
    const user = await this.userService.findOne('user13');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest14')
  async guest14Login(@Res() res: Response) {
    const user = await this.userService.findOne('user14');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest15')
  async guest15Login(@Res() res: Response) {
    const user = await this.userService.findOne('user15');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest16')
  async guest16Login(@Res() res: Response) {
    const user = await this.userService.findOne('guest16');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest17')
  async guest17Login(@Res() res: Response) {
    const user = await this.userService.findOne('guest17');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest18')
  async guest18Login(@Res() res: Response) {
    const user = await this.userService.findOne('guest18');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest19')
  async guest19Login(@Res() res: Response) {
    const user = await this.userService.findOne('guest19');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest20')
  async guest20Login(@Res() res: Response) {
    const user = await this.userService.findOne('guest20');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest21')
  async guest21Login(@Res() res: Response) {
    const user = await this.userService.findOne('guest21');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest22')
  async guest22Login(@Res() res: Response) {
    const user = await this.userService.findOne('user22');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest23')
  async guest23Login(@Res() res: Response) {
    const user = await this.userService.findOne('user23');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest24')
  async guest24Login(@Res() res: Response) {
    const user = await this.userService.findOne('user24');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest25')
  async guest25Login(@Res() res: Response) {
    const user = await this.userService.findOne('user25');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest26')
  async guest26Login(@Res() res: Response) {
    const user = await this.userService.findOne('user26');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest27')
  async guest27Login(@Res() res: Response) {
    const user = await this.userService.findOne('user27');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest28')
  async guest28Login(@Res() res: Response) {
    const user = await this.userService.findOne('user28');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest29')
  async guest29Login(@Res() res: Response) {
    const user = await this.userService.findOne('user29');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest30')
  async guest30Login(@Res() res: Response) {
    const user = await this.userService.findOne('user30');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest31')
  async guest31Login(@Res() res: Response) {
    const user = await this.userService.findOne('user31');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest32')
  async guest32Login(@Res() res: Response) {
    const user = await this.userService.findOne('user32');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest33')
  async guest33Login(@Res() res: Response) {
    const user = await this.userService.findOne('user33');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest34')
  async guest34Login(@Res() res: Response) {
    const user = await this.userService.findOne('user34');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest35')
  async guest35Login(@Res() res: Response) {
    const user = await this.userService.findOne('user35');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest36')
  async guest36Login(@Res() res: Response) {
    const user = await this.userService.findOne('user36');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest37')
  async guest37Login(@Res() res: Response) {
    const user = await this.userService.findOne('user37');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest38')
  async guest38Login(@Res() res: Response) {
    const user = await this.userService.findOne('user38');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest39')
  async guest39Login(@Res() res: Response) {
    const user = await this.userService.findOne('user39');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest40')
  async guest40Login(@Res() res: Response) {
    const user = await this.userService.findOne('user40');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest41')
  async guest41Login(@Res() res: Response) {
    const user = await this.userService.findOne('user41');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest42')
  async guest42Login(@Res() res: Response) {
    const user = await this.userService.findOne('user42');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

    res.cookie('auth', token, { httpOnly: true });
    return res.redirect(this.configService.get('FRONTEND_BASE_URL'));
  }
  @Get('guest43')
  async guest43Login(@Res() res: Response) {
    const user = await this.userService.findOne('user43');
    await this.userService.updateAuthentication(user.id, false);
    const token = await this.authService.getLongExpiryJwtToken(user);
    console.log(token);

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
    const user = await this.authService.validateUser(cookieToken as User);

    const verified = speakeasy.totp.verify({
      secret: user.secret_code,
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
}
