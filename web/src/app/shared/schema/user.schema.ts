import * as Zod from 'zod';

export const userFileSchema = Zod.object({
    id: Zod.string().uuid(),
    name: Zod.string().min(2).max(100),
});
