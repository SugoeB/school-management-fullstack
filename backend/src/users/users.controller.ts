import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Cadastro de usuário comum.
  @Post()
  create(
    @Body()
    dto: CreateUserDto,
  ) {
    return this.usersService.create(dto);
  }

  // Lista usuários sem retornar senhas.
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // Busca um usuário por ID.
  @Get(':id')
  findById(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.usersService.findById(id);
  }
}
