import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/dto/user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

class UserGet {
  login: string;
  role: 'admin' | 'user';
}

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<UserGet> {
    if ((await this.userService.findOne(req.user.username)).role !== 'admin')
      throw new UnauthorizedException();
    const data: User = await this.userService.findById(id);
    const login = data.login;
    const role = data.role;
    return (await { login, role }) as UserGet;
  }
}
