import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ApiConfig } from 'src/config/api.config';
import { JwtService } from '@nestjs/jwt';
// controller
import { ApplicationController } from './application.controller';
// provider
import { ApplicationService } from './services/application.service';
import { RoleService } from 'src/role/services/role.service';
import { GenerateKeyAppService } from './services/generateKeyApp.service';
import { UserService } from 'src/auth/services/user.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthService } from 'src/auth/services/auth.service';
import { ManageAppGuard } from 'src/role/guards/manageApp.guard';

@Module({
    imports: [ApiConfig, PrismaModule],
    controllers: [ApplicationController],
    providers: [
        ApplicationService,
        RoleService,
        GenerateKeyAppService,
        UserService,
        AuthGuard,
        JwtService,
        AuthService,
        ManageAppGuard,
    ],
    exports: [ApplicationService, GenerateKeyAppService],
})
export class ApplicationModule {}
