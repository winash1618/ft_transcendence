import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      userName: 'mpatel',
      displayName: 'Mohammed',
      familyName: 'Patel',
      givenName: null,
      profileUrl: 'https://profile.intra.42.fr/users/mpatel',
      email: 'mpatel@student.42abudhabi.ae',
      phoneNumber: '+971 56 203 6999',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.userName === username);
  }
}
