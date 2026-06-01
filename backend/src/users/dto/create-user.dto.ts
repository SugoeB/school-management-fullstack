import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  // CPF será enviado sem máscara: 12345678901
  @IsString()
  @Length(11, 11)
  cpf!: string;

  @IsString()
  @Length(6, 50)
  password!: string;

  // Formato esperado: YYYY-MM-DD
  @IsDateString()
  birthDate!: string;

  // Campo usado internamente para diferenciar usuário comum e professor.
  @IsOptional()
  @IsString()
  role?: string;
}
