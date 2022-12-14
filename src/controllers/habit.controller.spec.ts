import { Test, TestingModule } from '@nestjs/testing';
import { HabitService } from '../services/habit.service';
import { HabitController } from './habit.controller';
import { AuthenticatedRequest } from '../lib/dto/authenticated-request.dto';
import { TimerLogCreateInput } from '../lib/dto/timer-log-create-input.dto';
import { LogTypes } from '../lib/dto/log-types.dto';
import { BinaryLogCreateInput } from '../lib/dto/binary-log-create-input.dto';
import { EntityNotFound } from '../lib/errors/habit-not-found';
import { InvalidType } from '../lib/errors/invalid-type';
import { ForbiddenAccess } from '../lib/errors/forbidden-access';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UniqueConstraintFail } from '../lib/errors/unique-constraint-fail';
import { HabitUpdateInput } from '../lib/dto/habit-update-input.dto';
import { Response } from 'express';

describe('HabitController', () => {
  let moduleRef: TestingModule;
  let controller: HabitController;
  let service: HabitService;

  const fakeExpressResponse = {
    status: jest.fn().mockReturnValue({
      send: () => undefined,
    }),
  };

  const fakeAuthReq: AuthenticatedRequest = {
    user: {
      id: 1,
      email: 'user@email.com',
      username: 'user',
    },
  };
  const fakeTimerLogCreateInput: TimerLogCreateInput = {
    day: '2013-10-01',
    timerValue: 15,
  };
  const fakeBinaryLogCreateInput: BinaryLogCreateInput = {
    day: '2013-10-01',
  };
  const fakeHabitUpdateInput: HabitUpdateInput = {
    title: 'habit-title',
    color: 'FFFFFF',
  };
  const fakeHabitId = 1;
  const fakeHabitLogId = 1;
  const fakeUserId = 1;

  describe('log user habit', () => {
    it('should logUserTimerHabit', async () => {
      const habitId = 1;

      moduleRef = await Test.createTestingModule({
        controllers: [HabitController],
      })
        .useMocker((token) => {
          if (token === HabitService) {
            return {
              logUserHabit: jest.fn(),
            };
          }
        })
        .compile();

      controller = moduleRef.get<HabitController>(HabitController);

      await controller.logUserTimerHabit(
        habitId,
        fakeTimerLogCreateInput,
        fakeAuthReq,
      );

      service = moduleRef.get<HabitService>(HabitService);

      expect(service.logUserHabit).toHaveBeenCalledWith(
        habitId,
        fakeAuthReq.user.id,
        fakeTimerLogCreateInput,
        LogTypes.Timer,
      );
    });

    it('should logUserBinaryHabit', async () => {
      const habitId = 1;

      moduleRef = await Test.createTestingModule({
        controllers: [HabitController],
      })
        .useMocker((token) => {
          if (token === HabitService) {
            return {
              logUserHabit: jest.fn(),
            };
          }
        })
        .compile();

      controller = moduleRef.get<HabitController>(HabitController);

      await controller.logUserBinaryHabit(
        habitId,
        fakeBinaryLogCreateInput,
        fakeAuthReq,
      );

      service = moduleRef.get<HabitService>(HabitService);

      expect(service.logUserHabit).toHaveBeenCalledWith(
        habitId,
        fakeAuthReq.user.id,
        fakeBinaryLogCreateInput,
        LogTypes.Binary,
      );
    });

    it('should handle EntityNotFound error', async () => {
      moduleRef = await Test.createTestingModule({
        controllers: [HabitController],
      })
        .useMocker((token) => {
          if (token === HabitService) {
            return {
              logUserHabit: jest
                .fn()
                .mockRejectedValue(new EntityNotFound('Habit', fakeHabitId)),
            };
          }
        })
        .compile();

      controller = moduleRef.get<HabitController>(HabitController);

      expect(async () => {
        await controller.logUserBinaryHabit(
          fakeHabitId,
          fakeBinaryLogCreateInput,
          fakeAuthReq,
        );
      }).rejects.toThrow(NotFoundException);

      expect(async () => {
        await controller.logUserTimerHabit(
          fakeHabitId,
          fakeTimerLogCreateInput,
          fakeAuthReq,
        );
      }).rejects.toThrow(NotFoundException);
    });

    it('should handle InvalidType error', async () => {
      moduleRef = await Test.createTestingModule({
        controllers: [HabitController],
      })
        .useMocker((token) => {
          if (token === HabitService) {
            return {
              logUserHabit: jest
                .fn()
                .mockRejectedValue(new InvalidType('dummy')),
            };
          }
        })
        .compile();

      controller = moduleRef.get<HabitController>(HabitController);

      expect(async () => {
        await controller.logUserBinaryHabit(
          fakeHabitId,
          fakeBinaryLogCreateInput,
          fakeAuthReq,
        );
      }).rejects.toThrow(BadRequestException);

      expect(async () => {
        await controller.logUserTimerHabit(
          fakeHabitId,
          fakeTimerLogCreateInput,
          fakeAuthReq,
        );
      }).rejects.toThrow(BadRequestException);
    });

    it('should handle ForbiddenAccess error', async () => {
      moduleRef = await Test.createTestingModule({
        controllers: [HabitController],
      })
        .useMocker((token) => {
          if (token === HabitService) {
            return {
              logUserHabit: jest
                .fn()
                .mockRejectedValue(new ForbiddenAccess(1, 1, 'dummy')),
            };
          }
        })
        .compile();

      controller = moduleRef.get<HabitController>(HabitController);

      expect(async () => {
        await controller.logUserBinaryHabit(
          fakeHabitId,
          fakeBinaryLogCreateInput,
          fakeAuthReq,
        );
      }).rejects.toThrow(ForbiddenException);

      expect(async () => {
        await controller.logUserTimerHabit(
          fakeHabitId,
          fakeTimerLogCreateInput,
          fakeAuthReq,
        );
      }).rejects.toThrow(ForbiddenException);
    });

    it('should handle UniqueConstraintFail error', async () => {
      moduleRef = await Test.createTestingModule({
        controllers: [HabitController],
      })
        .useMocker((token) => {
          if (token === HabitService) {
            return {
              logUserHabit: jest
                .fn()
                .mockRejectedValue(new UniqueConstraintFail('dummy')),
            };
          }
        })
        .compile();

      controller = moduleRef.get<HabitController>(HabitController);

      expect(async () => {
        await controller.logUserBinaryHabit(
          fakeHabitId,
          fakeBinaryLogCreateInput,
          fakeAuthReq,
        );
      }).rejects.toThrow(BadRequestException);

      expect(async () => {
        await controller.logUserTimerHabit(
          fakeHabitId,
          fakeTimerLogCreateInput,
          fakeAuthReq,
        );
      }).rejects.toThrow(BadRequestException);
    });
  });

  describe('update user habit', () => {
    it('should updateUserHabit', async () => {
      moduleRef = await Test.createTestingModule({
        controllers: [HabitController],
      })
        .useMocker((token) => {
          if (token === HabitService) {
            return {
              updateUserHabit: jest.fn(),
            };
          }
        })
        .compile();

      controller = moduleRef.get<HabitController>(HabitController);

      await controller.updateUserHabit(
        fakeUserId,
        fakeHabitUpdateInput,
        fakeAuthReq,
        fakeExpressResponse as unknown as Response,
      );

      service = moduleRef.get<HabitService>(HabitService);

      expect(service.updateUserHabit).toHaveBeenCalledWith(
        fakeUserId,
        fakeHabitUpdateInput,
        fakeAuthReq.user.id,
      );
    });

    it('should updateUserHabit and return NOT_FOUND status code', async () => {
      moduleRef = await Test.createTestingModule({
        controllers: [HabitController],
      })
        .useMocker((token) => {
          if (token === HabitService) {
            return {
              updateUserHabit: jest.fn().mockResolvedValue(0),
            };
          }
        })
        .compile();

      controller = moduleRef.get<HabitController>(HabitController);

      await controller.updateUserHabit(
        fakeUserId,
        fakeHabitUpdateInput,
        fakeAuthReq,
        fakeExpressResponse as unknown as Response,
      );

      expect(fakeExpressResponse.status).toHaveBeenCalledWith(
        HttpStatus.NOT_FOUND,
      );
    });

    it('should updateUserHabit and return OK status code', async () => {
      moduleRef = await Test.createTestingModule({
        controllers: [HabitController],
      })
        .useMocker((token) => {
          if (token === HabitService) {
            return {
              updateUserHabit: jest.fn().mockResolvedValue(1),
            };
          }
        })
        .compile();

      controller = moduleRef.get<HabitController>(HabitController);

      await controller.updateUserHabit(
        fakeUserId,
        fakeHabitUpdateInput,
        fakeAuthReq,
        fakeExpressResponse as unknown as Response,
      );

      expect(fakeExpressResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });

  describe('delete user habit', () => {
    it('should delete return 200 status code', async () => {
      moduleRef = await Test.createTestingModule({
        controllers: [HabitController],
      })
        .useMocker((token) => {
          if (token === HabitService) {
            return {
              deleteUserHabit: jest.fn().mockResolvedValue(true),
            };
          }
        })
        .compile();

      controller = moduleRef.get<HabitController>(HabitController);

      await controller.deleteUserHabit(
        fakeHabitId,
        fakeAuthReq,
        fakeExpressResponse as unknown as Response,
      );

      service = moduleRef.get<HabitService>(HabitService);

      expect(service.deleteUserHabit).toHaveBeenCalledWith(
        fakeHabitId,
        fakeAuthReq.user.id,
      );

      expect(fakeExpressResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should delete return 404 status code in case not found', async () => {
      moduleRef = await Test.createTestingModule({
        controllers: [HabitController],
      })
        .useMocker((token) => {
          if (token === HabitService) {
            return {
              deleteUserHabit: jest.fn().mockResolvedValue(false),
            };
          }
        })
        .compile();

      controller = moduleRef.get<HabitController>(HabitController);

      await controller.deleteUserHabit(
        fakeHabitId,
        fakeAuthReq,
        fakeExpressResponse as unknown as Response,
      );

      service = moduleRef.get<HabitService>(HabitService);

      expect(service.deleteUserHabit).toHaveBeenCalledWith(
        fakeHabitId,
        fakeAuthReq.user.id,
      );

      expect(fakeExpressResponse.status).toHaveBeenCalledWith(
        HttpStatus.NOT_FOUND,
      );
    });
  });

  describe('delete user habit log', () => {
    it('should delete return 200 status code', async () => {
      moduleRef = await Test.createTestingModule({
        controllers: [HabitController],
      })
        .useMocker((token) => {
          if (token === HabitService) {
            return {
              deleteUserHabitLog: jest.fn().mockResolvedValue(true),
            };
          }
        })
        .compile();

      controller = moduleRef.get<HabitController>(HabitController);

      await controller.deleteUserHabitLog(
        fakeHabitId,
        fakeHabitLogId,
        fakeAuthReq,
        fakeExpressResponse as unknown as Response,
      );

      service = moduleRef.get<HabitService>(HabitService);

      expect(service.deleteUserHabitLog).toHaveBeenCalledWith(
        fakeHabitId,
        fakeHabitLogId,
        fakeAuthReq.user.id,
      );

      expect(fakeExpressResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should delete return 404 status code in case not found', async () => {
      moduleRef = await Test.createTestingModule({
        controllers: [HabitController],
      })
        .useMocker((token) => {
          if (token === HabitService) {
            return {
              deleteUserHabitLog: jest.fn().mockResolvedValue(false),
            };
          }
        })
        .compile();

      controller = moduleRef.get<HabitController>(HabitController);

      await controller.deleteUserHabitLog(
        fakeHabitId,
        fakeHabitLogId,
        fakeAuthReq,
        fakeExpressResponse as unknown as Response,
      );

      service = moduleRef.get<HabitService>(HabitService);

      expect(service.deleteUserHabitLog).toHaveBeenCalledWith(
        fakeHabitId,
        fakeHabitLogId,
        fakeAuthReq.user.id,
      );

      expect(fakeExpressResponse.status).toHaveBeenCalledWith(
        HttpStatus.NOT_FOUND,
      );
    });
  });
});
