import * as Zod from 'zod';
import { permissionSchema } from './permissions.schema';
import { userFileSchema } from './user.schema';

export const folderSchema = Zod.object({
    id: Zod.string().uuid(),
    name: Zod.string().min(2).max(100),
    path: Zod.string(),
    createdAt: Zod.date(),
    updatedAt: Zod.date(),
    Owner: userFileSchema,
    parentId: Zod.string().uuid().optional(),
    Permissions: Zod.array(permissionSchema).optional(),
    NbFiles: Zod.number().int(),
    size: Zod.number().int(),
});
