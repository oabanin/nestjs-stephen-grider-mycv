import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieSession from 'cookie-session';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { buildErrors } from './infrastracture/utils/buildErrors';

// import { setupApp } from './setup-app';
//import { AllExceptionsFilter } from './infrastracture/filters/all-exceptions.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableShutdownHooks();
  // WE can put ALL middlewares into separate file (setup app)
  // OR Add them into module

  // app.use(
  //   cookieSession({
  //     keys: ['1asfjksahjfksahkfashkjfhsjakhfjksahfjkashfj'],
  //   }),
  // );
  // app.enableCors();
  // app.enableShutdownHooks(); //  Starts listening for shutdown hooks
  // app.useGlobalPipes(
  //   //ADD standart validation pipe
  //   new ValidationPipe({
  //     transform: true, // DTO is parsed and becomes an instance.
  //     whitelist: true, //allows add additional params in post not in schema
  //     exceptionFactory: (errors) => {
  //       //return new BadRequestException(errors);
  //       return new BadRequestException(buildErrors(errors));
  //     },
  //   }),
  // );
  // setupApp(app);
  // console.log(httpAdapter);

  await app.listen(3000);
}
bootstrap();

// serializer (also similar like projection in MONGODB) - interceptor that defines what to expose (or what to exclude) before send response to user
// guard (check if user is authorized)
// Interceptor (check if possible to)
