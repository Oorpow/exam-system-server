import { IsNotEmpty } from 'class-validator';

export class CreateExamDto {
  @IsNotEmpty({ message: '试题名称不能为空' })
  name: string;
}
