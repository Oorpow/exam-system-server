import { PrismaService } from '@app/prisma';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RegisterUserDto } from './dto/register.dto';
import { comparePwdByHash, genSaltAndHashPwd } from './utils';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prisma: PrismaService;

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
      throw new BadRequestException('用户已存在');
    }

    try {
      // 3. 密码加密处理
      const cryptoPassword = genSaltAndHashPwd(registerDto.password);
      console.log(cryptoPassword);

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
      throw new BadRequestException('注册失败');
    }
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const existUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!existUser) {
      throw new BadRequestException('用户名或密码错误');
    }

    const isSame = comparePwdByHash(password, existUser.password);
    if (!isSame) {
      throw new BadRequestException('用户名或密码错误');
    }

    delete existUser.password;
    return existUser;
  }
}
