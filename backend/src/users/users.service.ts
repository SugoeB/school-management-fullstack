import { BadRequestException, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async create(dto: CreateUserDto) {
    // Verifica se já existe usuário com o mesmo CPF.
    const existingUser = await this.database.query(
      `
      SELECT id
      FROM users
      WHERE cpf = $1
      `,
      [dto.cpf],
    );

    if (existingUser.rows.length > 0) {
      throw new BadRequestException('CPF já cadastrado');
    }

    // Gera hash da senha antes de salvar no banco.
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const role = dto.role ?? 'USER';

    const result = await this.database.query(
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
        $5
      )
      RETURNING
        id,
        name,
        cpf,
        birth_date,
        role,
        created_at
      `,
      [dto.name, dto.cpf, passwordHash, dto.birthDate, role],
    );

    return result.rows[0];
  }

  async findAll() {
    // Nunca retornamos o campo password.
    const result = await this.database.query(
      `
      SELECT
        id,
        name,
        cpf,
        birth_date,
        role,
        created_at
      FROM users
      ORDER BY id
      `,
    );

    return result.rows;
  }

  async findById(id: number) {
    const result = await this.database.query(
      `
      SELECT
        id,
        name,
        cpf,
        birth_date,
        role,
        created_at
      FROM users
      WHERE id = $1
      `,
      [id],
    );

    return result.rows[0];
  }

  async findByCpf(cpf: string) {
    // Este método retorna password porque será usado no login.
    const result = await this.database.query(
      `
      SELECT
        id,
        name,
        cpf,
        password,
        birth_date,
        role,
        created_at
      FROM users
      WHERE cpf = $1
      `,
      [cpf],
    );

    return result.rows[0];
  }
}
