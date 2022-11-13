import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaConnector } from '../lib/prisma.connector';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaConnector) {}

  async findOne(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
