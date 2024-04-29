import * as Zod from 'zod';

export const roleSchema = Zod.object({
    id: Zod.string().uuid(),
    name: Zod.string().min(2).max(100),
    addedUser: Zod.boolean(),
    manageRole: Zod.boolean(),
    manageApp: Zod.boolean(),
    createdAt: Zod.date(),
    updatedAt: Zod.date(),
});

export const createRoleSchema = Zod.object({
    name: Zod.string().min(2).max(100),
    addedUser: Zod.boolean(),
    manageRole: Zod.boolean(),
    manageApp: Zod.boolean(),
});
