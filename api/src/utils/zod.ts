import { ZodType } from 'zod';

export type getZodOutput<zodType extends ZodType> = zodType extends ZodType<infer T> ? T : never;
