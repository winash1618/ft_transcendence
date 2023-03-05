import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(private usersService: UsersService){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:process.env.JWT_SECRET,
    });
  }

  async validate(payload:any){
    console.log('payload', payload);
    const user = await this.usersService.findOne(payload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
