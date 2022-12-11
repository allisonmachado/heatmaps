import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

describe('AuthService', () => {
  let service: AuthService;

  const fakeUsername = 'username';
  const fakeEmail = 'user@email.com';
  const fakePwd = 'asd';
  const fakeSignedValue = 'fake-signed-value';

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

  it('should sign user token', async () => {
    const fakeUser = {
      id: 1,
      email: fakeEmail,
      username: fakeUsername,
    };
    const fakeJwtService = {
      sign: jest.fn().mockReturnValue(fakeSignedValue),
    };
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return fakeJwtService;
        }
        return {};
      })
      .compile();

    service = moduleRef.get<AuthService>(AuthService);

    const result = await service.loginUser(fakeUser);

    expect(result).toEqual({
      accessToken: fakeSignedValue,
    });

    expect(fakeJwtService.sign).toHaveBeenCalledWith({
      sub: fakeUser.id,
      email: fakeUser.email,
      username: fakeUser.username,
    });
  });
});
