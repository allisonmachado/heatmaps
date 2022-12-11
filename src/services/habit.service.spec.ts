import { Test, TestingModule } from '@nestjs/testing';
import { PrismaConnector } from '../lib/db/prisma.connector';
import { LogTypes } from '../lib/dto/log-types.dto';
import { EntityNotFound } from '../lib/errors/habit-not-found';
import { InvalidType } from '../lib/errors/invalid-type';
import { HabitService } from './habit.service';

describe('HabitService', () => {
  const fakeHabitId = 1;
  const fakeUserId = 1;
  const fakeTimerLogCreateInput = {
    day: '2022-12-11',
    timerValue: 60,
  };

  it('should fail if habit does not exist', async () => {
    const fakePrismaConnector = {
      habit: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [HabitService],
    })
      .useMocker((token) => {
        if (token === PrismaConnector) {
          return fakePrismaConnector;
        }
      })
      .compile();

    const service = moduleRef.get<HabitService>(HabitService);

    expect(async () => {
      await service.logUserHabit(
        fakeHabitId,
        fakeUserId,
        fakeTimerLogCreateInput,
        LogTypes.Timer,
      );
    }).rejects.toThrow(EntityNotFound);
  });

  it('should fail if habit does not exist', async () => {
    const fakePrismaConnector = {
      habit: {
        findUnique: jest.fn().mockResolvedValue({
          type: LogTypes.Binary,
        }),
      },
    };
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [HabitService],
    })
      .useMocker((token) => {
        if (token === PrismaConnector) {
          return fakePrismaConnector;
        }
      })
      .compile();

    const service = moduleRef.get<HabitService>(HabitService);

    expect(async () => {
      await service.logUserHabit(
        fakeHabitId,
        fakeUserId,
        fakeTimerLogCreateInput,
        LogTypes.Timer,
      );
    }).rejects.toThrow(InvalidType);
  });
});
