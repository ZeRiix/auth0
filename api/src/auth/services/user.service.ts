import {
    BadRequestException,
    Inject,
    Logger,
    Injectable,
    NotAcceptableException,
    NotFoundException,
    PreconditionFailedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { getZodOutput } from 'src/utils/zod';
import { capitalizeWords } from 'src/utils/globals';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    /**
     * @param {string} id
     * @return {Promise<{ id: string; name: string; email: string; applicationId: string; createdAt: Date; updatedAt: Date; }>}
     * Get user by id
     */
    get(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
}
