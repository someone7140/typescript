import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

Injectable();
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err: any, authInfo: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !authInfo) {
      throw err || new UnauthorizedException();
    }
    return authInfo;
  }
}
