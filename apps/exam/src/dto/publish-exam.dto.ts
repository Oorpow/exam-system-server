import { IsNotEmpty } from 'class-validator';

export class PublishExamOrNotDto {
  @IsNotEmpty({ message: 'exam id不能为空' })
  id: number;

  @IsNotEmpty()
  isPublish: boolean;
}
