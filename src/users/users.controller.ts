import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  HttpStatus,
  Body,
  Delete,
  Redirect,
  Res,
  UseGuards,
  ParseIntPipe,
  Query,
  Session,
  // UseInterceptors,
  // ClassSerializerInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
// import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
// @UseInterceptors(ClassSerializerInterceptor) //Not the best solution to exclude password from response - Default intercepptor
// @UseInterceptors(new SerializeInterceptor(UserDto)) // REplaced to my own decorator
// @UseInterceptors(CurrentUserInterceptor) // MOVED interceptor to providers
@Serialize(UserDto) // Serialization for every route (remove password from user dto). IF remove serializer it will return also password that is wrog
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.id);
  // }

  // @Get('/whoami')
  // whoAmI(@Request() request: Request) {
  //   // Give access to user object through interceptor
  //   return request.user;
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard) //check  user id exist. IF not returns forbilled
  whoAmI(@CurrentUser() user: User) {
    // Give access to user object through decorator + interceptor
    return user;
  }
  @Get('/signout')
  signout(@Session() session: any) {
    session.id = null;
  }

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    return session.color;
  }
  @Post('signin')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Session() session: any) {
    const user = await this.authService.signin(loginUserDto);
    session.id = user.id;
    return user;
  }
  @Post('signup')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signup(createUserDto);
    session.id = user.id;
    return user;
  }

  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }

  @Get('testCreate')
  createTest(@Res() res: Response) {
    res.status(HttpStatus.EXPECTATION_FAILED).send();
  }

  @Get('testCreate2')
  createTest2(@Res() res: Response) {
    res.status(HttpStatus.OK).json([]);
  }

  // @Get(':id')
  // findUser(@Param('id', ParseIntPipe) id: number) {
  //   return this.usersService.findOne(id);
  // }

  //@UseInterceptors(ClassSerializerInterceptor) //Not the best solution to exclude password from response - Default intercepptor
  //@UseInterceptors(new SerializeInterceptor(UserDto)) // REplaced to my own decorator

  // @Serialize(UserDto)
  @Get(':id')
  findUser(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.usersService.findOne(id);
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.findByEmail1(email);
  }

  @Patch(':id')
  updateUser(
    @Body() createUserDto: UpdateUserDto,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.usersService.update(createUserDto, id);
  }

  @Delete(':id')
  removeUser(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.usersService.remove(id);
  }
}
