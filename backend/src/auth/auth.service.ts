import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from './interface/auth';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from '@prisma/client';
import moment from 'moment';

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

  async getJwtToken(user): Promise<string> {
    const payload = {
      ...user,
    }
    return this.jwtService.signAsync(payload);
  }

  async getRefreshToken(user): Promise<string> {
    const userDataToUpdate = {
      refreshToken: await this.jwtService.signAsync(user),
      refreshTokenExp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    };
    await this.userService.update(user.email, userDataToUpdate);
    return userDataToUpdate.refreshToken;
  }

  public async validRefreshToken(email: string, pass: string): Promise<User> {
    const currentDate = Date.now();
    const user = await this.userService.findOne(email);
    if (!user) {
      return null;
    }
    let currentUser = {
      ...user,
    }
    return currentUser;
  }
}
