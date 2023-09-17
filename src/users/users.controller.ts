import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Delete,
  Query,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { BodyDto } from './body.dto';

@Controller('auth')
export class UsersController {
  constructor(public usersService: UsersService) {}

  @Post('signup')
  createUser(@Body() createUserDto: BodyDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findUser(@Param() params: { id: string }) {
    return this.usersService.findOne(params.id);
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Patch(':id')
  updateUser(@Body() createUserDto: BodyDto, @Param() params: { id: string }) {
    return this.usersService.update(createUserDto, params.id);
  }

  @Delete(':id')
  removeUser(@Param() params: { id: string }) {
    return this.usersService.remove(params.id);
  }
}
