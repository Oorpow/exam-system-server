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
import { PublishExamOrNotDto } from './dto/publish-exam.dto';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get('list')
  list(@LoggedUser('userId') userId: number, @Query('bin') bin: string) {
    return this.examService.list(userId, bin);
  }

  @Get(':id')
  findOne(
    @LoggedUser('userId') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.examService.findOne(id, userId);
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

  @Post('publishOrNot')
  publishOrNot(
    @Body() publishExamDto: PublishExamOrNotDto,
    @LoggedUser('userId') userId: number,
  ) {
    return this.examService.publishOrNot(publishExamDto, userId);
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
