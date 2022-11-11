import { Test, TestingModule } from '@nestjs/testing';
import { PrismaConnector } from '../lib/prisma-connector';
import { UserService } from './user.service';

describe.only('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaConnector],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
