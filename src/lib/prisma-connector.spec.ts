import { Test, TestingModule } from '@nestjs/testing';
import { PrismaConnector } from './prisma-connector';

describe('PrismaConnectorService', () => {
  let service: PrismaConnector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaConnector],
    }).compile();

    service = module.get<PrismaConnector>(PrismaConnector);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
