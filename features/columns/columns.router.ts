import express, { Router, Response, Request } from "express";
import { validate } from "../../middlewares/validation.middleware";
import { columnsGetRequestSchema } from "./columns.schema";
import { getBoardColumns } from "./columns.service";
export const columnsRouter: Router = express.Router();

columnsRouter.get(
  "/:boardId",
  validate(columnsGetRequestSchema),
  async (req: Request, res: Response) => {
    const {
      params: { boardId },
    } = columnsGetRequestSchema.parse(req);

    try {
      const data = await getBoardColumns(boardId);
      res.json({ status: 200, success: true, data });
    } catch (error) {
      throw error;
    }
  }
);
