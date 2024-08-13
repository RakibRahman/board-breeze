import { describe } from "node:test";
import { z } from "zod";
import { uuidValidation } from "../../models/schema";

const sortBySchema = z.object({
  name: z.string(),
  order: z.enum(["ASC", "DESC"]),
});

const querySchema = z.string();

const paginationSchema = z.object({
  page: z.number(),
  size: z.number(),
});

export const boardGetRequestSchema = z.object({
  body: z.object({
    id: uuidValidation,
    onlyMe: z.boolean(),
    page: paginationSchema.shape.page,
    size: paginationSchema.shape.size,
    sortBy: sortBySchema,
    query: querySchema.optional(),
  }),
});

export const boardDTO = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
  creator_id: uuidValidation,
});

export const boardPostRequestSchema = z.object({
  body: boardDTO,
});

export type Board = z.infer<typeof boardDTO>;
export type BoardPayload = z.infer<typeof boardGetRequestSchema>;