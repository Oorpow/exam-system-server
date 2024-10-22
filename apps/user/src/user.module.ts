import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '@app/prisma';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, CommonModule } from '@app/common';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class UserModule {}
