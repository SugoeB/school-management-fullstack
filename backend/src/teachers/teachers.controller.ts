import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/teachers')
@UseGuards(JwtAuthGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  create(
    @Body()
    dto: CreateTeacherDto,
  ) {
    return this.teachersService.create(dto);
  }

  @Get()
  findAll() {
    return this.teachersService.findAll();
  }
}
