import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: number;
  cpf: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // O objeto retornado por validate será anexado em req.user
  // nas rotas protegidas pelo JwtAuthGuard.
  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      cpf: payload.cpf,
      role: payload.role,
    };
  }
}
