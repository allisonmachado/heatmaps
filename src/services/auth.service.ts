import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(
    email: string,
    pwd: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findOne(email);

    if (user && user.password === pwd) {
      delete user.password;

      return user;
    }

    return null;
  }
}
