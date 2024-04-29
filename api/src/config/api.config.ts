import * as path from 'path';
import { registerAs } from '@nestjs/config';
import * as Zod from 'zod';
import 'dotenv/config';

export class ApiConfig {
    private static schema = Zod.object({
        server: Zod.object({
            port: Zod.number(),
            host: Zod.string(),
        }),
        token: Zod.object({
            algorithm: Zod.literal('HS256'),
            accessSecret: Zod.string(),
            refreshSecret: Zod.string(),
            expireIn: Zod.number(),
            refreshExpireIn: Zod.number(),
            type: Zod.literal('JWT'),
        }),
        db: Zod.object({
            type: Zod.union([
                Zod.literal('mysql'),
                Zod.literal('mariadb'),
                Zod.literal('postgres'),
            ]),
            host: Zod.string(),
            port: Zod.number(),
            username: Zod.string(),
            password: Zod.string(),
            database: Zod.string(),
        }),
        mail: Zod.object({
            host: Zod.string(),
            port: Zod.number(),
            secure: Zod.boolean(),
            auth: Zod.object({
                user: Zod.string(),
                pass: Zod.string(),
            }),
            name: Zod.string(),
        }),
    });
    // Get config from .env file
    private static generateConf() {
        return {
            server: {
                port: parseInt(process.env.PORT),
                host: process.env.HOST,
            },
            token: {
                algorithm: process.env.TOKEN_ALGORITHM,
                accessSecret: process.env.TOKEN_ACCESS_SECRET,
                refreshSecret: process.env.TOKEN_REFRESH_SECRET,
                expireIn: parseInt(process.env.TOKEN_EXPIRE_IN),
                refreshExpireIn: parseInt(process.env.REFRESH_TOKEN_EXPIRE_IN),
                type: 'JWT',
            },
            db: {
                host: process.env.DATABASE_HOST,
                port: parseInt(process.env.DATABASE_PORT),
                type: 'postgres',
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASS,
                database: process.env.DATABASE_NAME,
            },
            mail: {
                host: process.env.MAIL_HOST,
                port: parseInt(process.env.MAIL_PORT),
                secure: process.env.MAIL_SECURE === 'true',
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
                name: process.env.MAIL_NAME,
            },
        };
    }

    private static config: typeof ApiConfig.schema extends Zod.ZodType<infer output>
        ? output
        : never;

    static get db() {
        return this.config.db;
    }

    static get server() {
        return this.config.server;
    }

    static get token() {
        return this.config.token;
    }

    static get mail() {
        return this.config.mail;
    }

    static {
        this.config = this.schema.parse(this.generateConf());
    }
}
