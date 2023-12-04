import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): object;
}
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //Run something before request is handled by the request handler
    // console.log('before the handler', context);

    return next.handle().pipe(
      map((data: any) => {
        //RUN something before the response is sent out
        // console.log('before the sent oyt', data);
        return plainToClass(this.dto, data, { excludeExtraneousValues: true }); //Remove other properties
      }),
    );
  }
}
