import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:3000',
      passReqToCallback: true,
    });
  }

	async validate(
		request: { session: { accessToken: string } },
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		cb: VerifyCallback
	): Promise<any> {
		request.session.accessToken = accessToken;
		console.log("accessToken", accessToken, "refreshToken", refreshToken);
		// In this example, the user's 42 profile is supplied as the user
		// record.  In a production-quality application, the 42 profile should
		// be associated with a user record in the application's database, which
		// allows for account linking and authentication with other identity
		// providers.
		return cb(null, profile);
  }

  async login(user: Profile) {
    console.log(user);
  }
}
