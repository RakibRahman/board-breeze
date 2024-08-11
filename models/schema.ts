import { z } from "zod";

export const uuidValidation = z.string().uuid();
export const idNumberRequestSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const idUUIDRequestSchema = z.object({
  params: z.object({
    id: uuidValidation,
  }),
});

export const pagingRequestSchema = z.object({
  query: z.object({
    take: z.coerce.number().int().positive(),
    skip: z.coerce.number().int().nonnegative(),
  }),
});
