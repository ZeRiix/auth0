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
} from '@nestjs/common';
import { Response } from 'express';

// local imports
import { UserService } from './services/user.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthGuard)
    async update(@Param('id') id: string, @Body() body: unknown, @Res() res: Response) {
        try {
            if (!body) throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
            //const user = registerSchema.parse(body);
            //const updatedUser = await this.userService.updateById(id, user);
            //res.status(HttpStatus.OK).json(updatedUser).send();
            res.status(HttpStatus.OK).send();
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }
}
