import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { HttpExceptionMsg } from './exception-msg';
import { SKIP_AUTH } from './constants';

interface JwtUserData {
  userId: number;
  username: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const response: Response = context.switchToHttp().getResponse();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(HttpExceptionMsg.TOKEN_NOT_FOUND);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'astrox',
      });
      request['user'] = payload;
      // 每次调用需要登录的接口时，自动刷新token实现续签
      response.setHeader('Access-Control-Expose-Headers', 'token');
      response.header(
        'token',
        this.jwtService.sign(
          {
            userId: payload.userId,
            username: payload.username,
          },
          {
            expiresIn: '1d',
          },
        ),
      );
    } catch (error) {
      throw new UnauthorizedException(HttpExceptionMsg.TOKEN_INVALID);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
