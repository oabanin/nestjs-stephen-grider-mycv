import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    //Run something before request is handled by the request handler
    const request = context.switchToHttp().getRequest();
    const { id } = request.session || {};

    if (id) {
      request.user = await this.usersService.findOne(id);
    }
    return next.handle(); // skip and go ahead
  }
}
