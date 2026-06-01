import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],

  // Exportamos o UsersService para o AuthModule usar no login.
  exports: [UsersService],
})
export class UsersModule {}
