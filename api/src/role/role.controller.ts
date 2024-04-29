import {
    Controller,
    Get,
    HttpStatus,
    Res,
    Param,
    Post,
    Patch,
    Body,
    Delete,
    UseGuards,
    BadRequestException,
    Put,
} from '@nestjs/common';
import { Response } from 'express';
// providers
import { RoleService } from './services/role.service';
// guards
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ManageRoleGuard } from './guards/manageRole.guard';
// schemas
import { createRoleSchema } from './schema/role.schema';

@Controller('application')
export class RoleController {
    constructor(private roleService: RoleService) {}

    @UseGuards(AuthGuard, ManageRoleGuard)
    @Post(':applicationId/role')
    async create(
        @Body() body: unknown,
        @Res() res: Response,
        @Param('applicationId') applicationId: string,
    ) {
        try {
            if (!body) throw new BadRequestException();
            const create = createRoleSchema.parse(body);
            const role = await this.roleService.create(applicationId, create);
            res.status(HttpStatus.CREATED).json({ id: role.id, name: role.name }).send();
        } catch (err) {
            res.status(err.status).json({ message: err.message }).send();
        }
    }

    @UseGuards(AuthGuard, ManageRoleGuard)
    @Put(':applicationId/role/:roleId')
    async update(
        @Body() body: unknown,
        @Res() res: Response,
        @Param('applicationId') applicationId: string,
        @Param('roleId') roleId: string,
    ) {
        try {
            if (!body) throw new BadRequestException();
            const update = createRoleSchema.parse(body);
            const role = await this.roleService.update(applicationId, roleId, update);
            res.status(HttpStatus.OK).json({ id: role.id, name: role.name }).send();
        } catch (err) {
            res.status(err.status).json({ message: err.message }).send();
        }
    }

    @UseGuards(AuthGuard, ManageRoleGuard)
    @Delete(':applicationId/role/:roleId')
    async delete(
        @Res() res: Response,
        @Param('applicationId') applicationId: string,
        @Param('roleId') roleId: string,
    ) {
        try {
            await this.roleService.delete(applicationId, roleId);
            res.status(HttpStatus.OK).send();
        } catch (err) {
            res.status(err.status).json({ message: err.message }).send();
        }
    }

    @UseGuards(AuthGuard, ManageRoleGuard)
    @Get(':applicationId/roles')
    async getsRoleOfApplication(
        @Res() res: Response,
        @Param('applicationId') applicationId: string,
    ) {
        try {
            const roles = await this.roleService.getRolesOfApplication(applicationId);
            res.status(HttpStatus.OK).json(roles).send();
        } catch (err) {
            res.status(err.status).json({ message: err.message }).send();
        }
    }

    @UseGuards(AuthGuard, ManageRoleGuard)
    @Patch(':applicationId/role/:roleId/user/:userId')
    async addRoleToUser(
        @Res() res: Response,
        @Param('applicationId') applicationId: string,
        @Param('roleId') roleId: string,
        @Param('userId') userId: string,
    ) {
        try {
            await this.roleService.addRoleToUser(userId, roleId, applicationId);
            res.status(HttpStatus.OK).send();
        } catch (err) {
            res.status(err.status).json({ message: err.message }).send();
        }
    }

    @UseGuards(AuthGuard, ManageRoleGuard)
    @Get(':applicationId/role/:roleId/users')
    async getUsersOfRole(
        @Res() res: Response,
        @Param('applicationId') applicationId: string,
        @Param('roleId') roleId: string,
    ) {
        try {
            const users = await this.roleService.getUsersOfRole(applicationId, roleId);
            res.status(HttpStatus.OK).json(users).send();
        } catch (err) {
            res.status(err.status).json({ message: err.message }).send();
        }
    }

    @UseGuards(AuthGuard, ManageRoleGuard)
    @Delete(':applicationId/role/:roleId/user/:userId')
    async withdrawRoleFromUser(
        @Res() res: Response,
        @Param('applicationId') applicationId: string,
        @Param('roleId') roleId: string,
        @Param('userId') userId: string,
    ) {
        try {
            await this.roleService.withdrawRoleFromUser(userId, roleId, applicationId);
            res.status(HttpStatus.OK).send();
        } catch (err) {
            res.status(err.status).json({ message: err.message }).send();
        }
    }
}
