import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: 'u-s4t2ud-21fc8c87c4e9ba88f04715d269ca79c3846c0587d2cdb052f1788d473043f5b7',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    console.log(profile);
  }
}
