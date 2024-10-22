import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { PrismaService } from '@app/prisma';

@Injectable()
export class AnswerService {
  constructor(private prisma: PrismaService) {}

  async create(createAnswerDto: CreateAnswerDto, uid: number) {
    // QUESTION 如果exam的isPublish为false，是否能够为其添加answer?
    return this.prisma.answer.create({
      data: {
        content: createAnswerDto.content,
        score: 0,
        answerer: {
          connect: {
            id: uid,
          },
        },
        exam: {
          connect: {
            id: createAnswerDto.examId,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.answer.findUnique({
      where: {
        id,
      },
      include: {
        exam: true,
        answerer: true,
      },
    });
  }

  async findAll(examId: number) {
    return this.prisma.answer.findMany({
      where: {
        examId,
      },
      include: {
        exam: true,
        answerer: true,
      },
    });
  }
}
