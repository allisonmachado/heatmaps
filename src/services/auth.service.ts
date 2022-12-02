import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../lib/dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

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

  async loginUser(user: Omit<User, 'password'>) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
