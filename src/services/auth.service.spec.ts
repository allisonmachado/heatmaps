import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

describe('AuthService', () => {
  let service: AuthService;

  const fakeEmail = 'user@email.com';
  const fakePwd = 'asd';

  it('should return null in case it does not find the user', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService],
    })
      .useMocker((token) => {
        if (token === UserService) {
          return {
            findOne: jest.fn().mockResolvedValue(null),
          };
        }
      })
      .compile();

    service = moduleRef.get<AuthService>(AuthService);

    const result = await service.validateUser(fakeEmail, fakePwd);

    expect(result).toBe(null);
  });

  it("should return null if password doesn't match", async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService],
    })
      .useMocker((token) => {
        if (token === UserService) {
          return {
            findOne: jest.fn().mockResolvedValue({
              name: 'John Doe',
              email: fakeEmail,
              password: '123',
            }),
          };
        }
      })
      .compile();

    service = moduleRef.get<AuthService>(AuthService);

    const result = await service.validateUser(fakeEmail, fakePwd);

    expect(result).toBe(null);
  });

  it('should return user if password match', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService],
    })
      .useMocker((token) => {
        if (token === UserService) {
          return {
            findOne: jest.fn().mockResolvedValue({
              name: 'John Doe',
              email: fakeEmail,
              password: fakePwd,
            }),
          };
        }
      })
      .compile();

    service = moduleRef.get<AuthService>(AuthService);

    const result = await service.validateUser(fakeEmail, fakePwd);

    expect(result).toEqual({
      name: 'John Doe',
      email: fakeEmail,
    });
  });
});
