import {
    Controller,
    Get,
    Req,
    HttpException,
    HttpStatus,
    Res,
    Param,
    Post,
    Patch,
    Body,
    Delete,
    Query,
    UseGuards,
    Request,
    Put,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
// providers
import { ApplicationService } from './services/application.service';
import { RoleService } from 'src/role/services/role.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/services/auth.service';
// schemas
import { attributeSchema, createAppSchema } from './schema/application.schema';
import { loginSchema } from 'src/auth/schema/user.schema';
// guards
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ManageAppGuard } from 'src/role/guards/manageApp.guard';

@Controller('application')
export class ApplicationController {
    constructor(
        private readonly applicationService: ApplicationService,
        private roleService: RoleService,
        private jwtService: JwtService,
        private authService: AuthService,
    ) {}

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() body: unknown, @Res() res: Response, @Request() request: Request) {
        try {
            if (!body) throw new BadRequestException();
            const create = createAppSchema.parse(body);
            const app = await this.applicationService.create(create);
            const role = await this.roleService.create(app.id, {
                name: 'Admin',
                addedUser: true,
                manageApp: true,
                manageRole: true,
            });
            try {
                await this.applicationService.addUserInApp(request['user'].id, app.id);
                await this.roleService.addRoleToUser(request['user'].id, role.id, app.id);
                res.status(HttpStatus.OK)
                    .json({ id: app.id, name: app.name, pulbicKey: app.publicKey })
                    .send();
            } catch (err) {
                await this.applicationService.delete(app.id);
                throw new HttpException(err.message, err.status);
            }
        } catch (err) {
            res.status(err.status).json({ message: err.message }).send();
        }
    }

    @Post(':id/login')
    async login(@Body() body: unknown, @Res() res: Response, @Param('id') id: string) {
        try {
            if (!body) throw new BadRequestException();
            const login = loginSchema.parse(body);
            const app = await this.applicationService.get(id);
            console.log(app.info[0]);
            const user = await this.authService.login(login);
            if (!user) throw new UnauthorizedException('User not found');
            if (!user.activated) throw new UnauthorizedException('User is not activated');
            const inApp = await this.applicationService.checkIfUserIsInApp(user.id, app.id);
            if (!inApp) throw new UnauthorizedException('User does not exist in this app');

            const token = await this.jwtService.signAsync(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    info: inApp.info,
                },
                {
                    secret: app.privateKey,
                    expiresIn: app.expiresIn,
                    algorithm: 'RS256',
                },
            );
            res.status(HttpStatus.OK)
                .json({ token: token, prefix: app.name + '-token' })
                .send();
        } catch (err) {
            res.status(err.status).json({ message: err.message }).send();
        }
    }

    @UseGuards(AuthGuard, ManageAppGuard)
    @Put(':id')
    async update(@Body() body: unknown, @Res() res: Response, @Param('id') id: string) {
        try {
            if (!body) throw new BadRequestException();
            const update = createAppSchema.parse(body);
            const app = await this.applicationService.update({
                id,
                name: update.name,
                expiresIn: update.expiresIn,
                info: update.info,
            });
            res.status(HttpStatus.OK)
                .json({ id: app.id, name: app.name, pulbicKey: app.publicKey })
                .send();
        } catch (err) {
            res.status(err.status).json({ message: err.message }).send();
        }
    }

    @UseGuards(AuthGuard, ManageAppGuard)
    @Patch(':id/user/:userId')
    async attributeInfoToUser(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @Body() body: unknown,
        @Res() res: Response,
    ) {
        try {
            if (!body) throw new BadRequestException();
            const info = attributeSchema.parse(body);
            await this.applicationService.addUserInfo(userId, id, info);
        } catch (err) {
            res.status(err.status).json({ message: err.message }).send();
        }
    }

    @UseGuards(AuthGuard, ManageAppGuard)
    @Delete(':id')
    async delete(@Param('id') id: string, @Res() res: Response) {
        try {
            await this.applicationService.delete(id);
            res.status(HttpStatus.OK).send();
        } catch (err) {
            res.status(err.status).json({ message: err.message }).send();
        }
    }

    @UseGuards(AuthGuard, ManageAppGuard)
    @Get(':id/users')
    async getUsersOfApplication(@Param('id') id: string, @Res() res: Response) {
        try {
            const users = await this.applicationService.getUsersInApp(id);
            res.status(HttpStatus.OK).json(users).send();
        } catch (err) {
            res.status(err.status).json({ message: err.message }).send();
        }
    }

    // TODO invite controller adn join controller
}
