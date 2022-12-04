import { Test, TestingModule } from '@nestjs/testing';
import { PrismaConnector } from '../lib/db/prisma.connector';
import { HabitService } from './habit.service';

describe('HabitService', () => {
  let service: HabitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HabitService, PrismaConnector],
    }).compile();

    service = module.get<HabitService>(HabitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
