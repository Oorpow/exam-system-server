import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateExamDto } from './dto/create-exam.dto';
import { LoggedUser } from '@app/common/custom.decorator';
import { SaveExamDto } from './dto/save-exam.dto';
import { PublishExamDto } from './dto/pubish-exam.dto';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get(':id')
  findOne(
    @LoggedUser('userId') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.examService.findOne(id, userId);
  }

  @Get('list')
  list(@LoggedUser('userId') userId: number, @Query('bin') bin: string) {
    return this.examService.list(userId, bin);
  }

  @Post()
  create(
    @Body() createExamDto: CreateExamDto,
    @LoggedUser('userId') userId: number,
  ) {
    return this.examService.create(createExamDto, userId);
  }

  // 保存试题
  @Post('save')
  save(@Body() saveExamDto: SaveExamDto) {
    return this.examService.save(saveExamDto);
  }

  @Post('publish')
  publish(
    @Body() publishExamDto: PublishExamDto,
    @LoggedUser('userId') userId: number,
  ) {
    return this.examService.publish(publishExamDto, userId);
  }

  @Delete(':id')
  removeOne(
    @LoggedUser('userId') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.examService.removeOne(id, userId);
  }

  @MessagePattern('sum')
  sum(nums: Array<number>): number {
    return nums.reduce((a, b) => a + b, 0);
  }
}
