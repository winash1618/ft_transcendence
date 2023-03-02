import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from './interface/auth';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService
    ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async validateUser(userDto: CreateUserDto): Promise<User> {
    const user = await this.userService.findOne(userDto.email);
    if (!user) {
      await this.userService.add42User(userDto);
    }
    return user;
  }

  async getJwt(user): Promise<string> {
    const payload = {
      id: user.id,
      login: user.login,
      email: user.email,
    }
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }

  public async validRefreshToken(email: string, pass: string): Promise<any> {
    // const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const user = await this.userService.findOne(email);
    if (!user) {
      return null;
    }
    return user;
    // let currentUser =
  }
}
