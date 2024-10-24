import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { LoggedUser } from '@app/common/custom.decorator';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Inject('EXAM_SERVICE')
  private examClient: ClientProxy;

  @Post()
  create(
    @Body() createAnswerDto: CreateAnswerDto,
    @LoggedUser('userId') userId: number,
  ) {
    return this.answerService.create(createAnswerDto, userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.answerService.findOne(id);
  }

  @Get('list')
  async findAll(@Query('examId', ParseIntPipe) examId: number) {
    return this.answerService.findAll(examId);
  }

  // TODO excel导出

  @Get()
  async getHello(): Promise<string> {
    const result = await firstValueFrom(this.examClient.send('sum', [1, 2, 3]));
    return `sth: ${result}`;
  }
}
