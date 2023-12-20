import {
  IsString,
  IsNumber,
  IsLongitude,
  IsLatitude,
  Min,
  Max,
} from 'class-validator';

import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/users.entity';

export class ReportDto {
  @Expose() // Means what is want to share with
  id: number;

  @Expose() // Means what is want to share with
  price: number;

  @Expose() // Means what is want to share with
  make: string;

  @Expose() // Means what is want to share with
  model: string;

  @Expose() // Means what is want to share with
  year: string;

  @Expose() // Means what is want to share with
  lng: number;

  @Expose() // Means what is want to share with
  lat: number;

  @Expose() // Means what is want to share with
  mileage: number;

  //GENERATE brandNew
  //obj is original report entity
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;

  @Expose()
  approved: boolean;
}
