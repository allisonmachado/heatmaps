import { Test, TestingModule } from '@nestjs/testing';
import { HabitService } from '../services/habit.service';
import { HabitController } from './habit.controller';
import { AuthenticatedRequest } from '../lib/dto/authenticated-request.dto';
import { TimerLogCreateInput } from '../lib/dto/timer-log-create-input.dto';
import { LogTypes } from '../lib/dto/log-types.dto';

describe('HabitController', () => {
  let moduleRef: TestingModule;
  let controller: HabitController;
  let service: HabitService;

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

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [HabitController],
    })
      .useMocker((token) => {
        if (
          token === HabitService &&
          expect.getState().currentTestName.includes('should logUserTimerHabit')
        ) {
          return {
            logUserHabit: jest.fn(),
          };
        }

        if (token === HabitService) return {};
      })
      .compile();

    controller = moduleRef.get<HabitController>(HabitController);
  });

  it('should be instantiated by DI-Container', () => {
    expect(controller).toBeDefined();
  });

  it('should logUserTimerHabit', () => {
    const habitId = 1;

    controller.logUserTimerHabit(habitId, fakeTimerLogCreateInput, fakeAuthReq);

    service = moduleRef.get<HabitService>(HabitService);

    expect(service.logUserHabit).toHaveBeenCalledWith(
      habitId,
      fakeAuthReq.user.id,
      fakeTimerLogCreateInput,
      LogTypes.Timer,
    );
  });
});
