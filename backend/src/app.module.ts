import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SchoolsModule } from './schools/schools.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    // Carrega variáveis do arquivo .env.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Módulo global de conexão com o PostgreSQL.
    DatabaseModule,

    UsersModule,
    AuthModule,
    SchoolsModule,
    TeachersModule,
    StudentsModule,
  ],
})
export class AppModule {}
