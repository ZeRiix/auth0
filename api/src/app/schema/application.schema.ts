import Zod from 'zod';

export const appSchema = Zod.object({
    id: Zod.string().uuid(),
    name: Zod.string().min(2).max(100),
    privateKey: Zod.string(),
    publicKey: Zod.string(),
    createdAt: Zod.date(),
    updatedAt: Zod.date(),
});

export const updateAppSchema = Zod.object({
    id: Zod.string().uuid(),
    name: Zod.string().min(2).max(100),
    expiresIn: Zod.number().min(100),
    info: Zod.array(Zod.string()),
});

export const deleteAppSchema = Zod.object({
    id: Zod.string().uuid(),
});

export const createAppSchema = Zod.object({
    name: Zod.string().min(2).max(100),
    expiresIn: Zod.number().min(100),
    info: Zod.array(Zod.string()),
});

export const inviteSchema = Zod.object({
    userEmail: Zod.string().email(),
    appId: Zod.string().uuid(),
});

export const attributeSchema = Zod.record(Zod.boolean());
