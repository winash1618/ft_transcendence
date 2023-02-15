import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { FortyTwoApi } from './FortyTwoAPI/FortyTwo.api';

@Injectable()
export class AuthService {
  private fortyTwoApi: FortyTwoApi;

  constructor(private userService: UsersService) {
    this.fortyTwoApi = new FortyTwoApi(new HttpService());
  }

  getHello(): string {
    return 'Hello World!';
  }

  fetchToken(code: string): void {
    this.fortyTwoApi.code = code;
    const Token = this.fortyTwoApi.retriveAccessToken();
    Token.then((token) => {
      this.fortyTwoApi.fetchUser(token);
    })
  }
}
