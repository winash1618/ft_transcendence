import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { userData } from './authDTO/user.dto';
import { FortyTwoApi } from './FortyTwoAPI/FortyTwo.api';

@Injectable()
export class AuthService {
  // constructor(private usersService: UsersService) {}
  private fortyTwoApi: FortyTwoApi;

  constructor() {this.fortyTwoApi = new FortyTwoApi(new HttpService());}

  getHello(): string {
    return 'Hello World!';
  }

  //able to fetch user data but can't make too many requests using retrieveAccessToken()
  fetchToken(code: string): void {
    this.fortyTwoApi.setCode(code);
    // this.fortyTwoApi.retriveAccessToken();
    this.fortyTwoApi.fetchUser();
  }

  // async validateUser(profile: userData): Promise<any> {
  //   const user = await this.usersService.findOne(profile.displayName);
  //   if (user) {
  //     return user;
  //   }
  //   return null;
  // }
}
