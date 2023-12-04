import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';

import { randomBytes, scrypt as _scrypt } from 'crypto';
import { LoginUserDto } from './dtos/login-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(createUserDto: CreateUserDto) {
    const users = await this.usersService.findBy(
      createUserDto.email.toString(),
    );
    if (users.length) {
      throw new BadRequestException('Email in use');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;
    const res = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create({
      email: createUserDto.email,
      password: res,
    });

    return user;
  }
  async signin(loginUserDto: LoginUserDto) {
    const [user] = await this.usersService.findByEmail1(loginUserDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(loginUserDto.password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }
    return user;
  }
}
