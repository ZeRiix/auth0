import { Controller, HttpStatus, Res, Post, Body, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

// providers
import { AuthService } from './services/auth.service';
import { JwtService } from '@nestjs/jwt';
// schemas
import { loginSchema, registerSchema } from './schema/user.schema';
// imports
import { ApiConfig } from 'src/config/api.config';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) {}

    @Post('login')
    async login(@Body() body: unknown, @Res() res: Response) {
        try {
            if (!body) throw new BadRequestException();
            const login = loginSchema.parse(body);
            const user = await this.authService.login(login);
            const token = await this.jwtService.signAsync(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                {
                    secret: ApiConfig.token.accessSecret,
                    expiresIn: ApiConfig.token.expireIn,
                    algorithm: ApiConfig.token.algorithm,
                },
            );
            const refresh_token = await this.jwtService.signAsync(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                {
                    secret: ApiConfig.token.refreshSecret,
                    expiresIn: ApiConfig.token.refreshExpireIn,
                    algorithm: ApiConfig.token.algorithm,
                },
            );
            res.status(HttpStatus.OK)
                .cookie('auth0-token', token)
                .cookie('auth0-token-refresh', refresh_token)
                .send();
        } catch (err) {
            res.status(err.status).json({ message: err.message }).send();
        }
    }

    @Post('register')
    async register(@Body() body: unknown, @Res() res: Response) {
        try {
            if (!body) throw new BadRequestException();
            const user = registerSchema.parse(body);
            await this.authService.register(user);
            res.status(HttpStatus.CREATED).send();
        } catch (err) {
            res.status(err.status).json({ message: err.message }).send();
        }
    }
}
