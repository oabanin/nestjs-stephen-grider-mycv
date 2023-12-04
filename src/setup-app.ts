import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { buildErrors } from './infrastracture/utils/buildErrors';

//import { AllExceptionsFilter } from './infrastracture/filters/all-exceptions.filter';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');
export const setupApp = (app: any) => {
  app.use(
    cookieSession({
      keys: ['1asfjksahjfksahkfashkjfhsjakhfjksahfjkashfj'],
    }),
  );
  app.enableCors();
  app.enableShutdownHooks(); //  Starts listening for shutdown hooks
  app.useGlobalPipes(
    //ADD standart validation pipe
    new ValidationPipe({
      transform: true, // DTO is parsed and becomes an instance.
      whitelist: true, //allows add additional params in post not in schema
      exceptionFactory: (errors) => {
        //return new BadRequestException(errors);
        return new BadRequestException(buildErrors(errors));
      },
    }),
  );
};
