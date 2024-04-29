import { Module } from '@nestjs/common';
import { ApiConfig } from './api.config';

@Module({
    providers: [
        {
            provide: ApiConfig,
            useValue: new ApiConfig(),
        },
    ],
    exports: [ApiConfig],
})
export class ConfigModule {}
