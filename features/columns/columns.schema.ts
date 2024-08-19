import { z } from "zod";
import { uuidValidation } from "../../models/schema";

export const columnsGetRequestSchema = z.object({
  params: z.object({
    boardId: uuidValidation,
  }),
});
