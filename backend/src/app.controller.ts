import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  checkCookie(@Req() request: Request) {
  }

  @Post()
  login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.cookie('esc', 'hellooooo1233433', {
      httpOnly: true,
      sameSite: 'strict',
      signed: false,
      path: '/',
      secure: false,
      expires: new Date(Date.now() + 900000),
    });
  }
}
