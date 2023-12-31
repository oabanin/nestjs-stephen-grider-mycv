import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Report } from './reports/report.entity';
import { DataSource } from 'typeorm';
import { OnApplicationShutdownHandler } from './shutdown.hook';

import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { buildErrors } from './infrastracture/utils/buildErrors';
import * as process from 'process';
import typeorm from './config/typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

//forRoot means sharing Module for all modules
@Module({
  imports: [
    ConfigModule.forRoot({
      //Should be first
      isGlobal: true, //DO not need to reimport,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return configService.get('typeorm');
      },
    }),
    // TypeOrmModule.forRootAsync({
    //   // SHOULD BE ASYNC IF WE USE CONFIG MODULE
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       type: 'sqlite', //sqil
    //       database: config.get<'string'>('DB_NAME'), //name
    //       entities: [User, Report],
    //       //synchronize: true, //only for first development,
    //       migrations: ['migrations/*.js'],
    //       migrationsTableName: 'custom_migration_table',
    //     };
    //   },
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite', //sqil
    //   database: 'db.sqlite', //name
    //   entities: [User, Report],
    //   synchronize: true, //only for first development
    // }),
    ReportsModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      //GLOBAL PIPE FROM INSIDE APP MODULE (INSTEAD IN MAIN.JS)
      useValue: new ValidationPipe({
        transform: true, // DTO is parsed and becomes an instance.
        whitelist: true, //allows add additional params in post not in schema
        exceptionFactory: (errors) => {
          //return new BadRequestException(errors);
          return new BadRequestException(buildErrors(errors));
        },
      }),
    },
    OnApplicationShutdownHandler,
  ],
})
export class AppModule {
  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    //This approach is better for testing
    //RUN on every request
    //GLOBAL MIDDLEWARE
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*'); //GLOBAL middleware for every request
  }
}
