import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { userData } from './authDTO/user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async validateUser(profile: userData): Promise<any> {
    const user = await this.usersService.findOne(profile.displayName);
    if (user) {
      return user;
    }
    return null;
  }
}
