import { Injectable } from '@nestjs/common';
import { PrismaConnector } from '../lib/db/prisma.connector';
import { HabitCreateInput } from '../lib/dto/habit-create-input';
import { HabitUpdateInput } from '../lib/dto/habit-update-input';

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

  async updateUserHabit(
    habitId: number,
    habit: HabitUpdateInput,
    userId: number,
  ) {
    const { count } = await this.prismaConnector.habit.updateMany({
      where: {
        AND: [
          {
            id: habitId,
          },
          {
            userId: userId,
          },
        ],
      },
      data: {
        ...habit,
      },
    });

    return count;
  }
}
