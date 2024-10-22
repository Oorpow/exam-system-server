import { IsNotEmpty } from 'class-validator';

export class PublishExamDto {
  @IsNotEmpty({ message: 'exam id不能为空' })
  id: number;
}
