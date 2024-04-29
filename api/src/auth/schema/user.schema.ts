import * as Zod from 'zod';

export const userSchema = Zod.object({
    id: Zod.string().uuid(),
    name: Zod.string().min(2).max(100),
    password: Zod.string(),
    email: Zod.string().email(),
    createdAt: Zod.date(),
    updatedAt: Zod.date(),
});

export const loginSchema = Zod.object({
    password: Zod.string()
        .min(8, 'Le mot de passe doit comporter au moins 8 caractères.')
        .max(40, 'Le mot de passe ne peut pas dépasser 40 caractères.')
        .refine((password) => /[0-9]/.test(password), {
            message: 'Le mot de passe doit contenir au moins un chiffre.',
        })
        .refine((password) => /[A-Z]/.test(password), {
            message: 'Le mot de passe doit contenir au moins une majuscule.',
        })
        .refine((password) => /[^a-zA-Z0-9]/.test(password), {
            message: 'Le mot de passe doit contenir au moins un caractère spécial.',
        }),
    email: Zod.string().email(),
});

export const registerSchema = Zod.object({
    name: Zod.string().min(2).max(100),
    password: Zod.string()
        .min(8, 'Le mot de passe doit comporter au moins 8 caractères.')
        .max(40, 'Le mot de passe ne peut pas dépasser 40 caractères.')
        .refine((password) => /[0-9]/.test(password), {
            message: 'Le mot de passe doit contenir au moins un chiffre.',
        })
        .refine((password) => /[A-Z]/.test(password), {
            message: 'Le mot de passe doit contenir au moins une majuscule.',
        })
        .refine((password) => /[^a-zA-Z0-9]/.test(password), {
            message: 'Le mot de passe doit contenir au moins un caractère spécial.',
        }),
    email: Zod.string().email(),
});
