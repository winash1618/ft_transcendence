import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(private usersService: UsersService){
    super({
      ignoreExpiration: false,
      secretOrKey:"My random secret key never let others",
      jwtFromRequest:ExtractJwt.fromExtractors([(request:Request) => {
        let data = request?.cookies["auth-cookie"];
        if(!data){
          return null;
        }
        return data.token
      }])
    });
  }

  async validate(payload:any){
    const user = await this.usersService.findOne(payload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
