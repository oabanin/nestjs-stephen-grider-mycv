import { Module } from '@nestjs/common';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Report } from './reports/report.entity';
import { DataSource } from 'typeorm';

//forRoot means sharing Module for all modules
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', //sqil
      database: 'db.sqlite', //name
      entities: [User, Report],
      synchronize: true, //only for first development
    }),
    ReportsModule,
    UsersModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
