// import { Catch, BadRequestException, Logger } from '@nestjs/common';
// import { BaseExceptionFilter } from '@nestjs/core';
// import { ValidationError } from 'class-validator';
//
// function getErrors(
//   exception: ValidationError[] | ValidationError,
//   errors: string[] = [],
// ): string[] {
//   if (Array.isArray(exception)) {
//     return exception.reduce<string[]>(
//       (acc, error) => getErrors(error, acc),
//       errors,
//     );
//   }
//
//   if (!(exception instanceof ValidationError)) {
//     return errors;
//   }
//
//   if (exception.constraints) {
//     errors = [...errors, ...Object.values(exception.constraints)];
//   }
//
//   if (exception.children?.length) {
//     return getErrors(exception.children, errors);
//   }
//
//   return errors;
// }
//
// @Catch()
// export class AllExceptionsFilter extends BaseExceptionFilter {
//   private readonly logger = new Logger(AllExceptionsFilter.name);
//
//   catch(exception: unknown) {
//     this.logger.log({ message: 'Global exception', exception });
//
//     if (Array.isArray(exception) && exception[0] instanceof ValidationError) {
//       const newErrors = getErrors(exception as any);
//       if (newErrors.length) {
//         throw new BadRequestException(newErrors);
//       }
//     }
//   }
// }

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
