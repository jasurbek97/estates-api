import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto, VerifyOtp } from './dto/index.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post('/verify')
  verify(@Body() payload: VerifyOtp) {
    return this.authService.verify(payload);
  }

  @Post('/login')
  login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
