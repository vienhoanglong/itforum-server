import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  hashData(data: string) {
    return argon2.hash(data);
  }
  async register(payload: RegisterDto): Promise<any> {
    //check if user exists by email
    const userExists = await this.userService.findByEmail(payload.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const hashPassword = await this.hashData(payload.password);
    const newUser = await this.userService.create({
      ...payload,
      password: hashPassword,
    });
    const tokens = await this.getTokens(
      newUser._id,
      newUser.email,
      newUser.fullName,
      newUser.username,
    );
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return tokens;
  }

  async login(payload: LoginDto) {
    // Check if user exists
    const user = await this.userService.findByEmail(payload.email);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(
      user.password,
      payload.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(
      user._id,
      user.email,
      user.fullName,
      user.username,
      user.role,
    );
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    return this.userService.update(userId, { refreshToken: null });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(
    userId: string,
    email: string,
    fullName: string,
    username: string,
    role?: number,
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          fullName,
          username,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          fullName,
          username,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.fullName,
      user.username,
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async checkLoginWithGoogle(payload: any): Promise<any> {
    try {
      const { email, name, sub, picture } = payload;
      const user = await this.userService.findOrCreateUser({
        googleId: sub,
        email,
        fullName: name,
        username: name,
        avatar: picture,
        role: 2,
      });
      const tokens = await this.getTokens(
        user._id,
        user.email,
        user.fullName,
        user.username,
        user.role,
      );
      await this.updateRefreshToken(user._id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException({
        message: `OAuth login error: ${error.message}`,
      });
    }
  }
}
