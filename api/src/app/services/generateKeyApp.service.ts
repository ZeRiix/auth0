import {
    BadRequestException,
    Inject,
    Logger,
    Injectable,
    NotAcceptableException,
    NotFoundException,
    PreconditionFailedException,
} from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class GenerateKeyAppService {
    /**
     * @return {Promise<{ publicKey: string; privateKey: string }>}
     * Generate a key pair (public and private)
     */
    async generateKeyPair() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        });

        return { publicKey, privateKey };
    }
}
