import {
  Controller,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, string>,
  ): Promise<{ access_token: string }> {
    return await this.authService.signIn(signInDto.login, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('registrate')
  async registrate(
    @Body() registrateDto: Record<string, string>,
  ): Promise<{ access_token: string }> {
    await this.authService.registrate(
      registrateDto.login,
      registrateDto.password,
    );

    return await this.authService.signIn(
      registrateDto.login,
      registrateDto.password,
    );
  }

  @UseGuards(AuthGuard)
  @Get('user-data')
  async getUserData(@Request() req) {
    const data = await this.userService.findOne(req.user.username);
    return {
      id: data.id,
      login: data.login,
      role: data.role,
    };
  }
}
