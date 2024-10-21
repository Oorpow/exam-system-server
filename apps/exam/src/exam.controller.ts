import { Controller, Get } from '@nestjs/common';
import { ExamService } from './exam.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  getHello(): string {
    return this.examService.getHello();
  }

  @MessagePattern('sum')
  sum(nums: Array<number>): number {
    return nums.reduce((a, b) => a + b, 0);
  }
}
