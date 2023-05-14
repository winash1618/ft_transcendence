import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    try {
      const token = client.handshake.auth.token;
      const decoded = this.jwtService.verify(token);
      client.data.userID = decoded;
      return true;
    } catch (error) {
      throw new WsException('Invalid token');
    }
  }
}
