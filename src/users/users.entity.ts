import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import { AfterInsert, AfterRemove, AfterUpdate } from 'typeorm';
import { Report } from '../reports/report.entity';
//import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @AfterInsert()
  logInsert() {
    console.log('inserted', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('removed', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('updated', this.id);
  }

  @OneToMany(() => Report, (report) => report.user) // FUnction prevent circular dependency
  reports: Report[];

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  //@Exclude() //EXCLUDE FROM RESPONSE
  //Better to convert this instanse to special DTO instanse with params that need to be exposed
  password: string;
}
