import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { CreateSchoolDto } from './dto/create-school.dto';

@Injectable()
export class SchoolsService {
  constructor(private readonly database: DatabaseService) {}

  async create(dto: CreateSchoolDto) {
    const result = await this.database.query(
      `
      INSERT INTO schools
      (
        name,
        address
      )
      VALUES
      (
        $1,
        $2
      )
      RETURNING *
      `,
      [dto.name, dto.address],
    );

    return result.rows[0];
  }

  async findAll() {
    const result = await this.database.query(
      `
      SELECT *
      FROM schools
      ORDER BY id
      `,
    );

    return result.rows;
  }
}
