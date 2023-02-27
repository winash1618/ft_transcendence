import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { FortyTwoApi } from './Strategy/FortyTwoAPI/FortyTwo.api';
import * as moment from 'moment';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private fortyTwoApi: FortyTwoApi;

  constructor(
    private jwtService: JwtService,
    private userService: UsersService
    ) {
    this.fortyTwoApi = new FortyTwoApi(new HttpService());
  }

  getHello(): string {
    return 'Hello World!';
  }

  fetchToken(code: string): void {
    this.fortyTwoApi.code = code;
    const Token = this.fortyTwoApi.retriveAccessToken();
    Token.then((token) => {
      const user = this.fortyTwoApi.fetchUser();
      user.then((user) => {
        this.userService.add42User(user);
      })
    })
  }

  async getJwt(user): Promise<string> {
    const payload = {
      id: user.id,
      login: user.login,
      email: user.email,
    }
    return this.jwtService.sign(payload);
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
