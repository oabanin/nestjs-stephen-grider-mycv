import {
  IsString,
  IsNumber,
  IsLongitude,
  IsLatitude,
  Min,
  Max,
} from 'class-validator';

import { Transform } from 'class-transformer';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  ///RECEIVE only property and part propery
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  mileage: number;

  ///RECEIVE only property and part propery
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  ///RECEIVE only property and part propery
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  ///RECEIVE only property and part propery
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;
}
