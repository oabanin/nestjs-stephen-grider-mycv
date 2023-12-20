import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log(request.user, 'request.user');
    if (!request.user) {
      return false;
    }
    return request.user.admin;
  }
}
