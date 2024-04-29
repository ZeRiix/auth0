import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

// local imports
import { ApiConfig } from 'src/config/api.config';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        let token = request.cookies['auth0-token'];
        const refreshToken = request.cookies['auth0-token-refresh'];

        if (!token && !refreshToken) throw new UnauthorizedException('Unauthorized');
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: ApiConfig.token.accessSecret,
            });
            request['user'] = payload;
        } catch {
            // Si le token d'accès est invalide, vérifiez le refresh token
            try {
                const refreshPayload = await this.jwtService.verifyAsync(refreshToken, {
                    secret: ApiConfig.token.refreshSecret,
                });
                // Utilisez le payload du refresh token pour générer un nouveau token d'accès et un nouveau refresh token
                token = await this.jwtService.signAsync(
                    {
                        id: refreshPayload.id,
                        name: refreshPayload.name,
                        email: refreshPayload.email,
                    },
                    {
                        secret: ApiConfig.token.accessSecret,
                        expiresIn: ApiConfig.token.expireIn,
                        algorithm: ApiConfig.token.algorithm,
                    },
                );
                const newRefreshToken = await this.jwtService.signAsync(
                    {
                        id: refreshPayload.id,
                        name: refreshPayload.name,
                        email: refreshPayload.email,
                    },
                    {
                        secret: ApiConfig.token.refreshSecret,
                        expiresIn: ApiConfig.token.refreshExpireIn,
                        algorithm: ApiConfig.token.algorithm,
                    },
                );
                // Enregistrez les nouveaux tokens dans les cookies
                response.cookie('auth0-token', token);
                response.cookie('auth0-token-refresh', newRefreshToken);

                request['user'] = refreshPayload;
            } catch {
                throw new UnauthorizedException('Unauthorized');
            }
        }

        return true;
    }

    extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
