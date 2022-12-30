import { Injectable } from '@nestjs/common';
import { HabitLog, Prisma } from '@prisma/client';
import { PrismaConnector } from '../lib/db/prisma.connector';
import { HabitCreateInput } from '../lib/dto/habit-create-input.dto';
import { HabitUpdateInput } from '../lib/dto/habit-update-input.dto';
import { LogCreateInput } from '../lib/dto/log-create-input.dto';
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

  async logUserHabit(habitId: number, userId: number, log: LogCreateInput) {
    const habit = await this.prismaConnector.habit.findUnique({
      where: {
        id: habitId,
      },
    });

    if (!habit) {
      throw new EntityNotFound('Habit', habitId);
    }

    if (habit.type !== log.type) {
      throw new InvalidType(log.type);
    }

    if (habit.userId !== userId) {
      throw new ForbiddenAccess(userId, habitId, 'Habit');
    }

    delete log.type;

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

  async listUserHabitLogs(
    userId: number,
    habitId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<HabitLog[]> {
    if (startDate >= endDate) {
      return [];
    }

    const habit = await this.prismaConnector.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
    });

    if (!habit) return [];

    return this.prismaConnector.habitLog.findMany({
      where: {
        habitId,
        day: {
          gt: startDate,
          lte: endDate,
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

  async deleteUserHabit(habitId: number, userId: number): Promise<boolean> {
    const habit = await this.prismaConnector.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
    });

    if (!habit) return false;

    const [, habitDeleted] = await this.prismaConnector.$transaction([
      this.prismaConnector.habitLog.deleteMany({
        where: {
          habitId,
        },
      }),
      this.prismaConnector.habit.delete({
        where: {
          id: habitId,
        },
      }),
    ]);

    return !!habitDeleted;
  }

  async deleteUserHabitLog(
    habitId: number,
    habitLogId: number,
    userId: number,
  ): Promise<boolean> {
    const habitLog = await this.prismaConnector.habitLog.findUnique({
      where: {
        id: habitLogId,
      },
    });

    if (!habitLog) return false;

    if (habitLog.habitId !== habitId) return false;

    const habit = await this.prismaConnector.habit.findFirst({
      where: {
        id: habitLog.habitId,
        userId,
      },
    });

    if (!habit) return false;

    const deletedHabitLog = await this.prismaConnector.habitLog.delete({
      where: {
        id: habitLogId,
      },
    });

    return !!deletedHabitLog;
  }
}
