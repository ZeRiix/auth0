import {
    BadRequestException,
    Inject,
    Logger,
    Injectable,
    NotAcceptableException,
    NotFoundException,
    PreconditionFailedException,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

import { loginSchema, registerSchema } from '../schema/user.schema';
import { PrismaService } from 'src/prisma/prisma.service';
import { getZodOutput } from 'src/utils/zod';
import { capitalizeWords } from 'src/utils/globals';
import { ApiConfig } from 'src/config/api.config';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async login(data: getZodOutput<typeof loginSchema>) {
        const { email, password } = data;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) throw new NotFoundException('User not found');
        if (!(await bcrypt.compare(password, user.password)))
            throw new UnauthorizedException('Invalid credentials');
        if (!user.activated) throw new UnauthorizedException('Account is not activated');
        return user;
    }

    async register(data: getZodOutput<typeof registerSchema>) {
        const { email, password, name } = data;
        const userExist = await this.prisma.user.findUnique({
            where: { email },
        });
        if (userExist) throw new NotAcceptableException('User already exist');
        const user = await this.prisma.user.create({
            data: {
                email,
                password: await bcrypt.hash(password, 10),
                name: capitalizeWords(name),
                activated: true, // set email activated to true TODO
            },
        });
        return user;
    }

    async sendMail(email: string, subject: string, html: string) {
        const transporter = nodemailer.createTransport({
            host: ApiConfig.mail.host,
            port: ApiConfig.mail.port,
            secure: ApiConfig.mail.secure,
            auth: ApiConfig.mail.auth,
        });
        const info = await transporter.sendMail({
            from: `"${ApiConfig.mail.name}" <${ApiConfig.mail.auth.user}>`,
            to: email,
            subject,
            html,
        });
        Logger.log(`Message sent: ${info.messageId}`);
    }

    async resetPassword(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new NotFoundException('User not found');
        
        const token = bcrypt.genSaltSync(10);
        await this.prisma.resetPassword.create({
            data: {
                token,
                user: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });
    }

    async getRequestResetPassword(userId: string) {
        const resetPassword = await this.prisma.resetPassword.findFirst({
            where: { userId },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (!resetPassword) throw new NotFoundException('Reset password not found');
        return resetPassword;
    }
}
