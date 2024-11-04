import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { SaveExamDto } from './dto/save-exam.dto';
import { PublishExamOrNotDto } from './dto/publish-exam.dto';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async create(createExamDto: CreateExamDto, uid: number) {
    return this.prisma.exam.create({
      data: {
        name: createExamDto.name,
        content: '',
        createUser: {
          connect: {
            id: uid,
          },
        },
      },
    });
  }

  async findOne(examId: number, uid: number) {
    return this.prisma.exam.findUnique({
      where: {
        id: examId,
        createUserId: uid,
      },
    });
  }

  async list(uid: number, bin: string) {
    let whereConditions = {};

    // 判断用户查询的是否是回收站的列表
    if (bin) {
      whereConditions = {
        createUserId: uid,
        isDelete: true,
      };
    } else {
      whereConditions = {
        createUserId: uid,
        isDelete: false,
      };
    }

    return this.prisma.exam.findMany({
      where: whereConditions,
    });
  }

  async save(saveExamDto: SaveExamDto) {
    return this.prisma.exam.update({
      where: {
        id: saveExamDto.id,
      },
      data: {
        content: saveExamDto.content,
      },
    });
  }

  publishOrNot(publishExamOrNotDto: PublishExamOrNotDto, uid: number) {
    return this.prisma.exam.update({
      where: {
        id: publishExamOrNotDto.id,
        createUserId: uid,
      },
      data: {
        isPublish: publishExamOrNotDto.isPublish,
      },
    });
  }

  async removeOne(examId: number, uid: number) {
    return this.prisma.exam.update({
      where: {
        id: examId,
        createUserId: uid,
      },
      data: {
        isDelete: true,
      },
    });
  }
}
