import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { userData } from './authDTO/user.dto';
import { FortyTwoApi } from './FortyTwoAPI/FortyTwo.api';

@Injectable()
export class AuthService {
  private fortyTwoApi: FortyTwoApi;

  constructor(private userService: UserService) {
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

  // async validateUser(profile: userData): Promise<any> {
  //   const user = await this.usersService.findOne(profile.displayName);
  //   if (user) {
  //     return user;
  //   }
  //   return null;
  // }
}
