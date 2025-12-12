import { Controller, Post, Body, HttpCode, Res, Get, Req, Header } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';

class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(body.email, body.password);
    const token = result?.access_token;
    if (token) {
      const maxAge = 1000 * 60 * 60; // 1 hour
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('token', token, { 
        httpOnly: true, 
        secure: isProduction, 
        sameSite: isProduction ? 'none' : 'lax', 
        maxAge 
      });
    }
    return { message: 'Login bem-sucedido' };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Logout realizado' };
  }

  @Get('me')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  async me(@Req() req: Request) {
    // read token from cookie (requires cookie-parser)
    const token = (req as any).cookies?.token as string | undefined;
    if (!token) {
      return { message: 'Não autenticado' };
    }
    const payload = this.authService.verifyToken(token);
    if (!payload) return { message: 'Não autenticado' };
    const user = await this.authService.findUserById(payload.sub);
    return { id: user.id, email: user.email, tenantDbName: user.tenantDbName };
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() body: LoginDto) {
    const user = await this.authService.register(body.email, body.password);
    return { message: 'Novo usuário cadastrado com sucesso', user };
  }
}
