import * as Zod from 'zod';

export const permissionSchema = Zod.object({
    id: Zod.string().uuid(),

    // Permissions de base
    canRead: Zod.boolean(),
    canWrite: Zod.boolean(),
    canDelete: Zod.boolean(),
    canShare: Zod.boolean(),
    canRename: Zod.boolean(),
    createdAt: Zod.date(),
    updatedAt: Zod.date(),
});
