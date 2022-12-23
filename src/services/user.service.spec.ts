import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaConnector } from '../lib/db/prisma.connector';
import { InvalidCredentials } from '../lib/errors/invalid-credentials';
import { Bcrypt } from '../lib/hash/bcrypt';
import { UserService } from './user.service';

describe('UserService', () => {
  it('should be defined', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaConnector, Bcrypt],
    }).compile();

    const service = module.get<UserService>(UserService);

    expect(service).toBeDefined();
  });

  it('should not pass with invalid password', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaConnector, Bcrypt],
    }).compile();

    const userService = module.get<UserService>(UserService);
    const bcrypt = module.get<Bcrypt>(Bcrypt);

    const fakeUser = {
      password: await bcrypt.hash('123456'),
    };

    expect(async () => {
      await userService.assertValidCredentials(fakeUser as User, 'abc');
    }).rejects.toThrow(InvalidCredentials);
  });

  it('should pass with a valid password', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaConnector, Bcrypt],
    }).compile();

    const userService = module.get<UserService>(UserService);
    const bcrypt = module.get<Bcrypt>(Bcrypt);

    const password = '123456';
    const fakeUser = {
      password: await bcrypt.hash(password),
    };

    await userService.assertValidCredentials(fakeUser as User, password);
  });
});
