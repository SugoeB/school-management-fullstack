import { BadRequestException, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { DatabaseService } from '../database/database.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private readonly database: DatabaseService) {}

  async create(dto: CreateTeacherDto) {
    // Verifica se a escola informada existe.
    const schoolExists = await this.database.query(
      `
      SELECT id
      FROM schools
      WHERE id = $1
      `,
      [dto.schoolId],
    );

    if (schoolExists.rows.length === 0) {
      throw new BadRequestException('Escola não encontrada');
    }

    // Verifica se já existe usuário com esse CPF.
    const cpfExists = await this.database.query(
      `
      SELECT id
      FROM users
      WHERE cpf = $1
      `,
      [dto.cpf],
    );

    if (cpfExists.rows.length > 0) {
      throw new BadRequestException('CPF já cadastrado');
    }

    // Criptografa a senha do professor.
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Primeiro cria um usuário para o professor.
    const userResult = await this.database.query(
      `
      INSERT INTO users
      (
        name,
        cpf,
        password,
        birth_date,
        role
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        'TEACHER'
      )
      RETURNING id
      `,
      [dto.name, dto.cpf, passwordHash, dto.birthDate],
    );

    const userId = userResult.rows[0].id;

    // Depois cria o professor associado ao usuário e à escola.
    const teacherResult = await this.database.query(
      `
      INSERT INTO teachers
      (
        user_id,
        school_id
      )
      VALUES
      (
        $1,
        $2
      )
      RETURNING *
      `,
      [userId, dto.schoolId],
    );

    return teacherResult.rows[0];
  }

  async findAll() {
    // Lista professores junto com os dados do usuário e da escola.
    const result = await this.database.query(
      `
      SELECT
        t.id,
        u.name,
        u.cpf,
        u.birth_date,
        s.id AS school_id,
        s.name AS school
      FROM teachers t
      INNER JOIN users u
        ON u.id = t.user_id
      INNER JOIN schools s
        ON s.id = t.school_id
      ORDER BY t.id
      `,
    );

    return result.rows;
  }
}
