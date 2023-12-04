import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      findAll: () => {
        return Promise.resolve([]);
      },
      findOne: (id) =>
        Promise.resolve({ id, email: '123@mail.ru', password: 'sd1' } as User),
      findByEmail1: (email) => {
        return Promise.resolve([{ id: 1, email, password: 'sd1' } as User]);
      },
      // update: (body, id) => {},
      // remove: (id) => {},
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (loginUserDto) =>
        Promise.resolve({
          id: 999,
          email: loginUserDto.email,
          password: loginUserDto.password,
        } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { useValue: fakeUserService, provide: UsersService },
        { useValue: fakeAuthService, provide: AuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //IMPOSSIBLE TO TEST Query params (decorators) and get request
  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('123@com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('123@com');
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUserService.findOne = () => Promise.resolve(null);
    const uset = await controller.findUser(1);
    await expect(uset).toBeNull();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    const session = { id: -10 };
    const uset = await controller.loginUser(
      {
        email: '123@123.com',
        password: '123',
      },
      session,
    );
    expect(uset.id).toEqual(999);
    expect(session.id).toEqual(999);
  });
});
