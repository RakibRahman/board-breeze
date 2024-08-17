import express, { NextFunction, Request, Response, Router } from "express";
import { validate } from "../../middlewares/validation.middleware";
import {
  boardDeleteRequestSchema,
  boardGetRequestSchema,
  boardPatchRequestSchema,
  boardPostRequestSchema,
} from "./boards.schema";
import {
  createBoard,
  deleteBoard,
  getUserBoards,
  updateBoard,
} from "./boards.service";

export const boardsRouter: Router = express.Router();

boardsRouter.get(
  "/",
  validate(boardGetRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = boardGetRequestSchema.parse(req);
    try {
      const boardList = await getUserBoards(body);
      return res.status(201).json(boardList);
    } catch (error) {
      next(error);
    }
  }
);

boardsRouter.post(
  "/",
  validate(boardPostRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = boardPostRequestSchema.parse(req);

    try {
      const data = await createBoard(body);
      return res
        .status(201)
        .json({ message: "Board created successfully", success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

boardsRouter.patch(
  "/:id",
  validate(boardPatchRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      body,
      params: { id },
    } = boardPatchRequestSchema.parse(req);

    try {
      const data = await updateBoard(id, body);
      return res
        .status(201)
        .json({ message: "Board updated successfully", success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

boardsRouter.delete(
  "/:id",
  validate(boardDeleteRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      params: { id },
    } = boardDeleteRequestSchema.parse(req);

    try {
      const data = await deleteBoard(id);
      return data
        ? res.send({
            status: 200,
            success: true,
            message: "Board Deleted successfully",
            data
          })
        : res.send({
            status: 404,
            success: false,
            message: "Board does not exists",
          });
    } catch (error) {
      next(error);
    }
  }
);
