import {
    Inject,
    Logger,
    Injectable,
    NotAcceptableException,
    NotFoundException,
    PreconditionFailedException,
} from '@nestjs/common';

// providers
import { PrismaService } from 'src/prisma/prisma.service';
import { GenerateKeyAppService } from './generateKeyApp.service';
// schemas
import { createAppSchema, updateAppSchema } from '../schema/application.schema';
// utils
import { getZodOutput } from 'src/utils/zod';

@Injectable()
export class ApplicationService {
    constructor(
        private prisma: PrismaService,
        private readonly generateKeyApp: GenerateKeyAppService,
    ) {}

    /**
     * @description Get application by id
     */
    get(id: string) {
        return this.prisma.application.findUnique({
            where: { id },
        });
    }

    /**
     * @description Create a new application
     */
    async create(data: getZodOutput<typeof createAppSchema>) {
        try {
            // eslint-disable-next-line prefer-const
            let { name, expiresIn, info } = data;
            const { privateKey, publicKey } = await this.generateKeyApp.generateKeyPair();
            const app = await this.prisma.application.create({
                data: {
                    name,
                    privateKey,
                    publicKey,
                    expiresIn,
                    info,
                },
            });
            return app;
        } catch (err) {
            throw new NotAcceptableException(err.message);
        }
    }

    /**
     * @description Update and refresh key of application
     */
    async update(data: getZodOutput<typeof updateAppSchema>) {
        // eslint-disable-next-line prefer-const
        let { id, name, info } = data;
        const { privateKey, publicKey } = await this.generateKeyApp.generateKeyPair();
        const app = await this.prisma.application.update({
            where: { id },
            data: {
                name,
                privateKey,
                publicKey,
                info,
            },
        });
        return app;
    }

    /**
     * @description delete application by id
     */
    async delete(id: string) {
        await this.prisma.application.delete({
            where: { id },
        });
    }

    /**
     * @description check if  user in application
     */
    checkIfUserIsInApp(userId: string, applicationId: string) {
        return this.prisma.usersOnApplications.findUnique({
            where: {
                userId_applicationId: {
                    userId,
                    applicationId,
                },
            },
        });
    }

    /**
     * @description add info to user by application
     */
    async addUserInfo(userId: string, applicationId: string, info: object) {
        const app = await this.get(applicationId);
        const validKeys = Array.isArray(app.info) ? app.info : [];

        if (!Object.keys(info).every((key) => validKeys.includes(key)))
            throw new PreconditionFailedException('Bad info'); // ajouter une gestion d'erreur plus propre TODO
        await this.prisma.usersOnApplications.update({
            where: {
                userId_applicationId: {
                    userId,
                    applicationId,
                },
            },
            data: {
                info,
            },
        });
    }

    /**
     * @description Add user in application
     */
    async addUserInApp(userId: string, applicationId: string) {
        await this.prisma.usersOnApplications.create({
            data: {
                userId,
                applicationId,
            },
        });
    }

    /**
     * @description Get all users in application
     */
    async getUsersInApp(applicationId: string) {
        const users = await this.prisma.usersOnApplications.findMany({
            where: {
                applicationId,
            },
            include: {
                user: true,
            },
        });
        return users.map((user) => user.user);
    }
}
