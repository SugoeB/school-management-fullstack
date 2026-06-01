import { BadRequestException, Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly database: DatabaseService) {}

  async create(dto: CreateStudentDto) {
    // Verifica se o professor informado existe.
    const teacherExists = await this.database.query(
      `
      SELECT id
      FROM teachers
      WHERE id = $1
      `,
      [dto.teacherId],
    );

    if (teacherExists.rows.length === 0) {
      throw new BadRequestException('Professor não encontrado');
    }

    // Verifica CPF único para alunos.
    const cpfExists = await this.database.query(
      `
      SELECT id
      FROM students
      WHERE cpf = $1
      `,
      [dto.cpf],
    );

    if (cpfExists.rows.length > 0) {
      throw new BadRequestException('CPF já cadastrado');
    }

    const result = await this.database.query(
      `
      INSERT INTO students
      (
        name,
        cpf,
        birth_date,
        teacher_id
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4
      )
      RETURNING *
      `,
      [dto.name, dto.cpf, dto.birthDate, dto.teacherId],
    );

    return result.rows[0];
  }

  async findAll() {
    // Lista alunos com o professor e a escola vinculada.
    const result = await this.database.query(
      `
      SELECT
        st.id,
        st.name,
        st.cpf,
        st.birth_date,
        t.id AS teacher_id,
        u.name AS teacher_name,
        s.id AS school_id,
        s.name AS school_name
      FROM students st
      INNER JOIN teachers t
        ON t.id = st.teacher_id
      INNER JOIN users u
        ON u.id = t.user_id
      INNER JOIN schools s
        ON s.id = t.school_id
      ORDER BY st.id
      `,
    );

    return result.rows;
  }
}
