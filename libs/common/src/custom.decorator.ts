import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import { SKIP_AUTH } from './constants';

interface JwtUserData {
  userId: number;
  username: string;
}

export const SkipAuth = () => SetMetadata(SKIP_AUTH, true);

export const LoggedUser = createParamDecorator(
  (data: keyof JwtUserData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);
