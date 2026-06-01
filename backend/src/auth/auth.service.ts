import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(cpf: string, password: string) {
    // Busca o usuário pelo CPF.
    // Esse método retorna também a senha com hash, necessária para comparação.
    const user = await this.usersService.findByCpf(cpf);

    if (!user) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }

    // Compara a senha digitada com o hash salvo no banco.
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }

    // Payload é o conteúdo que vai dentro do token JWT.
    const payload = {
      sub: user.id,
      cpf: user.cpf,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,

      user: {
        id: user.id,
        name: user.name,
        cpf: user.cpf,
        role: user.role,
      },
    };
  }

  async profile(userId: number) {
    // Retorna os dados do usuário logado sem a senha.
    return this.usersService.findById(userId);
  }
}
