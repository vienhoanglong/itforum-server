import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginGoogleDTO, RegisterDto } from './auth.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
// import { AuthGuard } from '@nestjs/passport';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(RoleGuard)
  @Roles(0)
  @ApiBearerAuth()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiBearerAuth()
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiBearerAuth()
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('loginGoogle')
  @ApiOperation({ summary: 'Login Google' })
  loginGoogle(@Body() loginGoogleDTO: LoginGoogleDTO) {
    return this.authService.checkLoginWithGoogle(loginGoogleDTO);
  }
}
