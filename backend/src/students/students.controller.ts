import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(
    @Body()
    dto: CreateStudentDto,
  ) {
    return this.studentsService.create(dto);
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }
}
