import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './users.entity';
import { BodyDto } from './body.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async create(body: BodyDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: body.email,
      },
    });
    if (user) {
      throw new BadRequestException(
        `User with email ${body.email} already exists`,
      );
    }
    return this.usersRepository.insert(body);
  }
  async findOne(id: string) {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`Wrong id`);
    }
    const user = await this.usersRepository.findOne({
      where: { id: idNumber },
    });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.usersRepository.find({ where: { email } });
  }

  async update(body: BodyDto, id: string) {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`Wrong id`);
    }
    const user = await this.usersRepository.findOne({
      where: { id: idNumber },
    });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    user.email = body.email;
    user.password = body.password;
    return await this.usersRepository.save(user);
  }
  async remove(id: string) {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`Wrong id`);
    }
    const user = await this.usersRepository.findOne({
      where: { id: idNumber },
    });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    return await this.usersRepository.remove(user);
  }
}
