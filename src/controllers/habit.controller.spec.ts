import { Test, TestingModule } from '@nestjs/testing';
import { PrismaConnector } from '../lib/db/prisma.connector';
import { HabitService } from '../services/habit.service';
import { HabitController } from './habit.controller';

describe('HabitController', () => {
  let controller: HabitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitController],
      providers: [HabitService, PrismaConnector],
    }).compile();

    controller = module.get<HabitController>(HabitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
