import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;
}
