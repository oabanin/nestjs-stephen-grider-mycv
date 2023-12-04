import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Auth service', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users = [];
    fakeUsersService = {
      findBy: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      findByEmail1: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (body: CreateUserDto) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email: body.email,
          password: body.password,
        };
        users.push(user);
        return Promise.resolve(user as User);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });
  it('can create an instance of auth service', async () => {
    //Create a fake copy of usersService (it needs inside auth service)
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed passwords', async () => {
    const user = await service.signup({
      email: 'aaa@aaa.com',
      password: '123',
    });
    expect(user.password).not.toEqual('123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.findBy = () =>
      Promise.resolve([
        { id: 1, email: '123@123.com', password: '123' } as User,
      ]);
    await expect(
      service.signup({ email: '123@123.com', password: '123' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws an NotFoundException if sign in is called with unused email', async () => {
    await expect(
      service.signin({ email: '1231asfasf@123.com', password: '1asds23' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws an Invalid password is provided', async () => {
    fakeUsersService.findBy = () =>
      Promise.resolve([
        { id: 1, email: '123@123.com', password: '123' } as User,
      ]);
    await expect(
      service.signin({ email: '123@123.com', password: '1234' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup({
      email: '1234577xxw@123.com',
      password: '123',
    });
    const user = await service.signin({
      email: '1234577xxw@123.com',
      password: '123',
    });
    expect(user).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup({
      email: '6543@123.com',
      password: '123',
    });
    await expect(
      service.signup({
        email: '6543@123.com',
        password: '123',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin({
        email: '6543ggg@123.com',
        password: '123',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup({
      email: '65ssss43ggg@123.com',
      password: '123',
    });
    await expect(
      service.signin({
        email: '65ssss43ggg@123.com',
        password: '1fsfs23',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
