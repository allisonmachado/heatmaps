import { Injectable } from '@nestjs/common';
import { PrismaConnector } from '../lib/db/prisma.connector';
import { HabitCreateInput } from '../lib/dto/habit-create-input';

@Injectable()
export class HabitService {
  constructor(private prismaConnector: PrismaConnector) {}

  async createUserHabit(habit: HabitCreateInput, userId: number) {
    await this.prismaConnector.habit.create({
      data: {
        ...habit,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}
