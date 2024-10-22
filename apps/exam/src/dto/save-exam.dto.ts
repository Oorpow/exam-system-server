import { IsNotEmpty, IsString } from 'class-validator';

export class SaveExamDto {
  @IsNotEmpty({ message: 'exam id不能为空' })
  id: number;

  @IsString()
  content: string;
}
