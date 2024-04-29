import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { ApplicationModule } from './app/application.module';

@Module({
    imports: [ConfigModule, PrismaModule, AuthModule, RoleModule, ApplicationModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
