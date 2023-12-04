import { Expose } from 'class-transformer';

export class UserDto {
  @Expose() // Means what is want to share with
  id: number;

  @Expose() // Means what is want to share with
  email: string;
}
