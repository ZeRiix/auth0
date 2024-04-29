import {
    Inject,
    Logger,
    Injectable,
    NotAcceptableException,
    NotFoundException,
    PreconditionFailedException,
    ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { getZodOutput } from 'src/utils/zod';
import { createRoleSchema } from '../schema/role.schema';
import { ApplicationService } from 'src/app/services/application.service';

@Injectable()
export class RoleService {
    constructor(private prisma: PrismaService, private applicationService: ApplicationService) {}

    async create(aplicationId: string, data: getZodOutput<typeof createRoleSchema>) {
        // eslint-disable-next-line  prefer-const
        let { name, addedUser, manageApp, manageRole } = data;
        const role = await this.prisma.role.create({
            data: {
                name,
                addedUser,
                manageApp,
                manageRole,
                application: {
                    connect: {
                        id: aplicationId,
                    },
                },
            },
        });
        return role;
    }

    async checkRole(
        userId: string,
        perm: { manageApp: boolean; manageRole: boolean; addedUser: boolean },
        applicationId: string,
    ) {
        const roles = await this.getRolesByApplicationAndUser(applicationId, userId);
        if (!roles || roles.length === 0) throw new NotFoundException('Role not found');
        const hasPermission = roles.some((role) => {
            return (
                (perm.manageApp && role.manageApp) ||
                (perm.manageRole && role.manageRole) ||
                (perm.addedUser && role.addedUser)
            );
        });
        if (!hasPermission) throw new ForbiddenException('Insufficient permissions');
        return roles;
    }

    async delete(applicationId: string, roleId: string) {
        if (!(await this.getRolesOfApplication(applicationId)).some((role) => role.id === roleId))
            throw new NotFoundException('Role not found');
        await this.prisma.role.delete({
            where: { id: roleId },
        });
    }

    async addRoleToUser(userId: string, roleId: string, applicationId: string) {
        if (!(await this.applicationService.checkIfUserIsInApp(userId, applicationId)))
            throw new PreconditionFailedException('User is not in the application');
        await this.prisma.rolesOfUsers.create({
            data: {
                userId,
                roleId,
            },
        });
    }

    async getRolesByApplicationAndUser(applicationId: string, userId: string) {
        const roles = await this.prisma.rolesOfUsers.findMany({
            where: {
                userId,
                role: {
                    applicationId,
                },
            },
            include: {
                role: true,
            },
        });

        return roles.map((role) => role.role);
    }

    async getRolesOfApplication(applicationId: string) {
        const roles = await this.prisma.role.findMany({
            where: {
                applicationId,
            },
        });
        return roles;
    }

    async update(
        applicationId: string,
        roleId: string,
        data: getZodOutput<typeof createRoleSchema>,
    ) {
        if (!(await this.getRolesOfApplication(applicationId)).some((role) => role.id === roleId))
            throw new NotFoundException('Role not found');
        // eslint-disable-next-line  prefer-const
        let { name, addedUser, manageApp, manageRole } = data;
        const role = await this.prisma.role.update({
            where: { id: roleId },
            data: {
                name,
                addedUser,
                manageApp,
                manageRole,
            },
        });
        return role;
    }

    async getUsersOfRole(applicationId: string, roleId: string) {
        if (!(await this.getRolesOfApplication(applicationId)).some((role) => role.id === roleId))
            throw new NotFoundException('Role not found');
        const users = await this.prisma.rolesOfUsers.findMany({
            where: {
                roleId,
            },
            include: {
                user: true,
            },
        });
        return users.map((user) => user.user);
    }

    async withdrawRoleFromUser(userId: string, roleId: string, applicationId: string) {
        if (!(await this.applicationService.checkIfUserIsInApp(userId, applicationId)))
            throw new PreconditionFailedException('User is not in the application');
        await this.prisma.rolesOfUsers.delete({
            where: {
                userId_roleId: {
                    userId,
                    roleId,
                },
            },
        });
    }
}
