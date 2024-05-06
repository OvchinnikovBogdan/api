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

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @Get('login')
  getUserData(@Request() req) {
    return { username: req.user.username };
  }
}
