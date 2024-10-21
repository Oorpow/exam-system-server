import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoggedUser, SkipAuth } from '@app/common/custom.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @SkipAuth()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.login(loginDto);
    const token = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
      },
      {
        expiresIn: '1d',
      },
    );
    return token;
  }

  @SkipAuth()
  @Post('register')
  register(@Body() registerDto: RegisterUserDto) {
    return this.userService.register(registerDto);
  }

  @Get('b')
  b(@LoggedUser() user) {
    console.log(user);
    return 'b';
  }
}
