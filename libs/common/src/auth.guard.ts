import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

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
    const skipAuth = this.reflector.getAllAndOverride<boolean>('skip-auth', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const response: Response = context.switchToHttp().getResponse();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'astrox',
      });
      request['user'] = payload;
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
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
