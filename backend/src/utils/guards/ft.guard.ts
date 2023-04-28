import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Injectable()
export class FtAuthGuard extends AuthGuard('42') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const res = httpContext.getResponse<Response>();
	console.log(err);
	console.log(user);
    if (err || !user) {
      return ;
    }

    return user;
  }
}
