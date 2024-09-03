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
    creator_id: uuidValidation,
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

export const boardPatchRequestSchema = z.object({
  params:z.object({
    id:uuidValidation
  }),
  body: boardDTO.omit({creator_id:true}),
});;

export const boardDeleteRequestSchema = boardPatchRequestSchema.pick({'params':true})

export type Board = z.infer<typeof boardDTO>;
export type BoardPayload = z.infer<typeof boardGetRequestSchema>;
export type BoardPatchPayload = z.infer<typeof boardPatchRequestSchema>['body']