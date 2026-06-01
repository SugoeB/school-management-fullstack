import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  // CPF sem máscara: 33333333333
  @IsString()
  @Length(11, 11)
  cpf!: string;

  // Formato esperado: YYYY-MM-DD
  @IsDateString()
  birthDate!: string;

  // ID de um professor existente
  @IsInt()
  teacherId!: number;
}
