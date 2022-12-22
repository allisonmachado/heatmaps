import { Test, TestingModule } from '@nestjs/testing';
import { Bcrypt } from './bcrypt';

describe('Bcrypt', () => {
  it('should be defined', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Bcrypt],
    }).compile();

    const service = module.get<Bcrypt>(Bcrypt);

    expect(service).toBeDefined();
  });

  it('should hash a small string and produce a bigger hash string', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [Bcrypt],
    }).compile();

    const service = moduleRef.get<Bcrypt>(Bcrypt);

    const password = '123456';
    const hash = await service.hash(password);

    expect(hash).not.toEqual(password);
    expect(hash.length).toBeGreaterThan(password.length);
  });

  it('should hash a password and be able to compare it later', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [Bcrypt],
    }).compile();

    const service = moduleRef.get<Bcrypt>(Bcrypt);

    const password = '123456';
    const hash = await service.hash(password);

    const match = await service.compare(password, hash);

    expect(match).toBe(true);
  });
});
