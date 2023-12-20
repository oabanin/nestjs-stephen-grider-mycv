import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/users.entity';
import { Report } from '../reports/report.entity';

dotenvConfig({ path: '.env' });

// const config = {
//   type: 'postgres',
//   host: `${process.env.DATABASE_HOST}`,
//   port: `${process.env.DATABASE_PORT}`,
//   username: `${process.env.DATABASE_USERNAME}`,
//   password: `${process.env.DATABASE_PASSWORD}`,
//   database: `${process.env.DATABASE_NAME}`,
//   entities: ['dist/**/*.entity{.ts,.js}'],
//   migrations: ['dist/migrations/*{.ts,.js}'],
//   autoLoadEntities: true,
//   synchronize: false,
// };
const config = {
  type: 'sqlite', //sqil
  database: 'db.sqlite', //name
  entities: [User, Report],
  synchronize: true, //only for first development,
  migrations: ['migrations/*.ts'],
  migrationsTableName: 'migrations',
};
export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
