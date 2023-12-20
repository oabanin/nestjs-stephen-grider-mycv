import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { AuthService } from './auth.service';
//import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])], //Creates repository
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    //BETTER USER MIDDLEWARE AS IN BOTTOM
    // {
    //   provide: APP_INTERCEPTOR, //GLOBALLY scoped interceptor(fetched on every route, put information about user into request.)
    //   useClass: CurrentUserInterceptor, //request.user
    // },
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    //This approach is better for testing
    //RUN on every request
    //GLOBAL MIDDLEWARE
    consumer.apply(CurrentUserMiddleware).forRoutes('*'); //GLOBAL middleware for every request
  }
}
