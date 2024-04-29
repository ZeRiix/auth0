import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { ApiConfig } from 'src/config/api.config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ApplicationModule } from 'src/app/application.module';

@Module({
    imports: [ApiConfig, PrismaModule, JwtModule, ApplicationModule],
    controllers: [AuthController, UserController],
    providers: [AuthService, UserService, AuthGuard, JwtService],
    exports: [AuthGuard, UserService],
})
export class AuthModule {}
