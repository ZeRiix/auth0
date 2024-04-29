import { CanActivate, ExecutionContext, Injectable, HttpException } from '@nestjs/common';
import { Request } from 'express';

import { RoleService } from '../services/role.service';

@Injectable()
export class AddUserGuard implements CanActivate {
    constructor(private readonly roleService: RoleService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        try {
            await this.roleService.checkRole(
                request['user'].id,
                {
                    addedUser: true,
                    manageApp: false,
                    manageRole: false,
                },
                request.params.applicationId ? request.params.applicationId : request.params.id,
            );
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
        return true;
    }
}
