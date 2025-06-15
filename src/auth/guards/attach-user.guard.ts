import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AttachUserGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    return user || null;
  }
}
