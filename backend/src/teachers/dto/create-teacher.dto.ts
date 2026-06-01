import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  // CPF sem máscara: 22222222222
  @IsString()
  @Length(11, 11)
  cpf!: string;

  @IsString()
  @Length(6, 50)
  password!: string;

  // Formato esperado: YYYY-MM-DD
  @IsDateString()
  birthDate!: string;

  // ID da escola existente
  @IsInt()
  schoolId!: number;
}
