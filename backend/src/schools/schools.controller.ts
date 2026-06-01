import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { SchoolsService } from './schools.service';

import { CreateSchoolDto } from './dto/create-school.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body()
    dto: CreateSchoolDto,
  ) {
    return this.schoolsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.schoolsService.findAll();
  }
}
