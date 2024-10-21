import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AnswerService } from './answer.service';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Inject('EXAM_SERVICE')
  private examClient: ClientProxy;

  @Get()
  async getHello(): Promise<string> {
    const result = await firstValueFrom(this.examClient.send('sum', [1, 2, 3]));
    return `sth: ${result}`;
  }
}
