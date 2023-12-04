import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const reqeust = context.switchToHttp().getRequest();
    console.log(reqeust.session.id);
    return reqeust.session.id;
  }
}
