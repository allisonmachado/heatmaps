import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaConnector } from '../lib/db/prisma.connector';
import { LogTypes } from '../lib/dto/log-types.dto';
import { ForbiddenAccess } from '../lib/errors/forbidden-access';
import { EntityNotFound } from '../lib/errors/habit-not-found';
import { InvalidType } from '../lib/errors/invalid-type';
import { UniqueConstraintFail } from '../lib/errors/unique-constraint-fail';
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

  it('should fail if the habit type does not match', async () => {
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

  it('should fail if the habit does not belong to the user', async () => {
    const fakePrismaConnector = {
      habit: {
        findUnique: jest.fn().mockResolvedValue({
          type: LogTypes.Timer,
          userId: 7,
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
    }).rejects.toThrow(ForbiddenAccess);
  });

  it('should create habit log', async () => {
    const fakePrismaConnector = {
      habit: {
        findUnique: jest.fn().mockResolvedValue({
          type: LogTypes.Timer,
          userId: fakeUserId,
        }),
      },
      habitLog: {
        create: jest.fn(),
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

    await service.logUserHabit(
      fakeHabitId,
      fakeUserId,
      fakeTimerLogCreateInput,
      LogTypes.Timer,
    );

    expect(fakePrismaConnector.habitLog.create).toHaveBeenCalled();
  });

  it('should fail if the habit log already exists', async () => {
    const fakePrismaConnector = {
      habit: {
        findUnique: jest.fn().mockResolvedValue({
          type: LogTypes.Timer,
          userId: fakeUserId,
        }),
      },
      habitLog: {
        create: jest
          .fn()
          .mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError('', 'P2002', '', null),
          ),
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
    }).rejects.toThrow(UniqueConstraintFail);
  });
});
