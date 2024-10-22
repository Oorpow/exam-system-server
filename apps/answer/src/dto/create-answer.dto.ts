import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty({ message: '答卷的内容不能为空' })
  @IsString()
  content: string;

  @IsNotEmpty()
  examId: number;
}
