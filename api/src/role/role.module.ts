import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { ApiConfig } from 'src/config/api.config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoleService } from './services/role.service';
import { UserService } from 'src/auth/services/user.service';
import { AddUserGuard } from './guards/addUser.guard';
import { ManageAppGuard } from './guards/manageApp.guard';
import { ManageRoleGuard } from './guards/manageRole.guard';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GenerateKeyAppService } from 'src/app/services/generateKeyApp.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [ApiConfig, PrismaModule],
    controllers: [RoleController],
    providers: [
        RoleService,
        UserService,
        AddUserGuard,
        ManageAppGuard,
        ManageRoleGuard,
        ApplicationService,
        AuthGuard,
        GenerateKeyAppService,
        JwtService,
    ],
    exports: [RoleService, AddUserGuard, ManageAppGuard, ManageRoleGuard],
})
export class RoleModule {}
