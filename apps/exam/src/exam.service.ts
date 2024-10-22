import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { SaveExamDto } from './dto/save-exam.dto';
import { PublishExamDto } from './dto/pubish-exam.dto';

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

  async publish(publishExamDto: PublishExamDto, uid: number) {
    return this.prisma.exam.update({
      where: {
        id: publishExamDto.id,
        createUserId: uid,
      },
      data: {
        isPublish: true,
      },
    });
  }

  async removeOne(uid: number, examId: number) {
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
