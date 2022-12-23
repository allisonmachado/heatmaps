import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaConnector } from '../lib/db/prisma.connector';
import { Bcrypt } from '../lib/hash/bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaConnector, private bcrypt: Bcrypt) {}

  async findOne(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  public async validatePassword(
    user: User,
    password: string,
  ): Promise<boolean> {
    return await this.bcrypt.compare(password, user.password);
  }
}
