import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(body: CreateUserDto) {
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

    // const newUser = this.usersRepository.create({
    //   email: body.email,
    //   password: body.password,
    // });
    //OR
    const newUser = new User();
    //Creating of instance is needed if there is a validation inside entity
    //HOOKS inside entity works
    newUser.password = body.password;
    newUser.email = body.email;

    return await this.usersRepository.save(newUser);

    //HOOKS inside entity does not work. We are working directly with repo, skipping entity
    ////Faster but no entity
    //
    // return await this.usersRepository.save({
    //   email: body.email,
    //   password: body.password,
    // });
    //or
    // return await this.usersRepository.insert(body);
  }
  async login(body: LoginUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: body.email,
        password: body.password,
      },
    });
    if (!user) {
      throw new BadRequestException(`Wrong email and password`);
    }

    // const newUser = this.usersRepository.create({
    //   email: body.email,
    //   password: body.password,
    // });
    //OR
    const newUser = new User();
    //Creating of instance is needed if there is a validation inside entity
    //HOOKS inside entity works
    newUser.password = body.password;
    newUser.email = body.email;

    return await this.usersRepository.save(newUser);

    //HOOKS inside entity does not work. We are working directly with repo, skipping entity
    ////Faster but no entity
    //
    // return await this.usersRepository.save({
    //   email: body.email,
    //   password: body.password,
    // });
    //or
    // return await this.usersRepository.insert(body);
  }
  async findOne(id: number) {
    if (!id) {
      return null;
    }
    // const idNumber = Number(id);
    // if (isNaN(idNumber)) {
    //   throw new BadRequestException(`Wrong id`);
    // }
    const user = await this.usersRepository.findOneBy({ id });
    //
    // const user = await this.dataSource
    //   .getRepository(User)
    //   .createQueryBuilder('user')
    //   .select(['user.id', 'user.email']) // added selection only id and email
    //   .where('user.id = :id', { id })
    //   .getOne();
    //
    // await dataSource
    //   .getRepository(User)
    //   .createQueryBuilder('user')
    //   .where('user.id = :id', { id: 1 })
    //   .getOne();
    //or
    // const user = await this.usersRepository.findOne({
    //   where: { id: idNumber },
    // });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findBy(email: string) {
    //return this.usersRepository.find({ where: { email } });
    return this.usersRepository.findBy({ email });
  }
  async findByEmail1(email: string) {
    //return this.usersRepository.find({ where: { email } });
    return this.usersRepository.findBy({ email });
  }

  async update(body: CreateUserDto, id: number) {
    // const idNumber = Number(id);
    // if (isNaN(idNumber)) {
    //   throw new BadRequestException(`Wrong id`);
    // }
    const user = await this.findOne(id);
    // user.email = body.email;
    // user.password = body.password;
    Object.assign(user, body);
    return await this.usersRepository.save(user);
  }
  async remove(id: number) {
    // const idNumber = Number(id);
    // if (isNaN(idNumber)) {
    //   throw new BadRequestException(`Wrong id`);
    // }
    const user = await this.findOne(id);
    //remove is designed to work with entity (Hooks in entity work) //slower because first need to get entity
    //delete is designed to work directly with repo  (Hooks in entity do not work) //Faster but no entity
    return await this.usersRepository.remove(user);
  }

  async findAll() {
    return await this.usersRepository.find();
  }
}
