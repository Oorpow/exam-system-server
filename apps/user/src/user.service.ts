import { PrismaService } from '@app/prisma';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { RegisterUserDto } from './dto/register.dto';
import { comparePwdByHash, genSaltAndHashPwd } from './utils';
import { LoginDto } from './dto/login.dto';
import { HttpExceptionMsg } from '@app/common/exception-msg';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  @Inject(JwtService)
  private jwtService: JwtService;

  private logger = new Logger();

  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data,
      select: {
        id: true,
      },
    });
  }

  async register(registerDto: RegisterUserDto) {
    // 1. 根据username查找库中用户
    const existUser = await this.prisma.user.findUnique({
      where: {
        username: registerDto.username,
      },
    });
    // 2. 已存在则提示
    if (existUser) {
      throw new BadRequestException(HttpExceptionMsg.USER_EXIST);
    }

    try {
      // 3. 密码加密处理
      const cryptoPassword = genSaltAndHashPwd(registerDto.password);

      // 4. 创建用户
      return await this.prisma.user.create({
        data: {
          username: registerDto.username,
          password: cryptoPassword,
          email: registerDto.email,
        },
        select: {
          id: true,
          username: true,
          email: true,
          createTime: true,
        },
      });
    } catch (error) {
      this.logger.error(error, UserService);
      throw new BadRequestException(HttpExceptionMsg.USER_REGISTER_ERROR);
    }
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const existUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!existUser) {
      throw new BadRequestException(HttpExceptionMsg.USER_NOT_FOUND);
    }

    const isSame = comparePwdByHash(password, existUser.password);
    if (!isSame) {
      throw new BadRequestException(
        HttpExceptionMsg.USERNAME_OR_PASSWORD_ERROR,
      );
    }

    const payload = {
      userId: existUser.id,
      username: existUser.username,
    };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
    };
  }
}
