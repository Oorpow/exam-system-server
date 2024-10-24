import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { PrismaService } from '@app/prisma';

@Injectable()
export class AnswerService {
  constructor(private prisma: PrismaService) {}

  // 答题并自动判卷算分
  async create(createAnswerDto: CreateAnswerDto, uid: number) {
    // 1. 找到考卷
    const exam = await this.prisma.exam.findUnique({
      where: { id: createAnswerDto.examId },
    });
    // 2. 解析成问题数组
    let examQuestions = [];
    try {
      examQuestions = JSON.parse(exam.content);
    } catch (error) {}

    // 3. 解析成答案数组
    let answers = [];
    try {
      answers = JSON.parse(createAnswerDto.content);
    } catch (error) {}

    let totalScore = 0;
    // 4. 遍历答案数组，去匹配考卷问题数组的答案
    answers.forEach((answerItem) => {
      const foundQuestion = examQuestions.find(
        (question) => question.id === answerItem.id,
      );
      // 填空题
      if (foundQuestion.type === 'input') {
        if (answerItem.answer.includes(foundQuestion.answer)) {
          totalScore += foundQuestion.score;
        }
      } else {
        // 选择题
        if (answerItem.answer === foundQuestion.answer) {
          totalScore += foundQuestion.score;
        }
      }
    });

    return this.prisma.answer.create({
      data: {
        content: createAnswerDto.content,
        score: totalScore,
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
