import * as Zod from 'zod';
import { permissionSchema } from './permissions.schema';
import { userFileSchema } from './user.schema';

const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB
const ACCEPTED_FILE_TYPES = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/gzip',
    'application/x-rar-compressed',
    'application/x-tar',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'video/mp4',
    'video/mpeg',
    'video/ogg',
    'video/webm',
];

export const fileSchema = Zod.object({
    id: Zod.string().uuid(),
    name: Zod.string().min(2).max(100),
    path: Zod.string(),
    mimeType: Zod.string().refine((mimeType) => ACCEPTED_FILE_TYPES.includes(mimeType)),
    size: Zod.number().int().min(0).max(MAX_FILE_SIZE),
    createdAt: Zod.date(),
    updatedAt: Zod.date(),
    parentId: Zod.string().uuid().optional(),
    Owner: userFileSchema,
    Permissions: Zod.array(permissionSchema).optional(),
});
