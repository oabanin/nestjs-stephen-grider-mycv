import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, input: ExecutionContext) => {
    //never prevents to pass the value
    const request = input.switchToHttp().getRequest();
    return request.user;
  },
);
