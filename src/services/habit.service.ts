import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaConnector } from '../lib/db/prisma.connector';
import { BinaryLogCreateInput } from '../lib/dto/binary-log-create-input';
import { HabitCreateInput } from '../lib/dto/habit-create-input';
import { HabitUpdateInput } from '../lib/dto/habit-update-input';
import { LogTypes } from '../lib/dto/log-types';
import { ForbiddenAccess } from '../lib/errors/forbidden-access';
import { EntityNotFound } from '../lib/errors/habit-not-found';
import { InvalidType } from '../lib/errors/invalid-type';
import { UniqueConstraintFail } from '../lib/errors/unique-constraint-fail';

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

  async logUserHabit(
    habitId: number,
    userId: number,
    log: BinaryLogCreateInput,
    type: LogTypes,
  ) {
    const habit = await this.prismaConnector.habit.findUnique({
      where: {
        id: habitId,
      },
    });

    if (!habit) {
      throw new EntityNotFound('Habit', habitId);
    }

    if (habit.type !== type) {
      throw new InvalidType(type);
    }

    if (habit.userId !== userId) {
      throw new ForbiddenAccess(userId, habitId, 'Habit');
    }

    try {
      await this.prismaConnector.habitLog.create({
        data: {
          ...log,
          day: new Date(log.day),
          habit: {
            connect: {
              id: habitId,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UniqueConstraintFail(`habit:${habitId} and day:${log.day}`);
      } else {
        throw error;
      }
    }
  }

  async listUserHabits(userId: number) {
    return this.prismaConnector.habit.findMany({
      where: {
        userId,
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
