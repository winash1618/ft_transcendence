import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService
  ) {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: any): Promise<any> {
    const user = await this.authService.validateUser({
      login: profile._json.login,
      email: profile._json.email,
      first_name: profile._json.first_name,
      last_name: profile.last_name,
	  opponentId: null,
	  isPlaying: false,
    });

    if (user) {
      done(null, user);
    } else {
      done(new UnauthorizedException(), false);
    }
  }
}
