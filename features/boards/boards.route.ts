import express, { NextFunction, Request, Response, Router } from "express";
import { createBoard, getUserBoards } from "./boards.service";
import { validate } from "../../middlewares/validation.middleware";
import { boardGetRequestSchema, boardPostRequestSchema } from "./boards.schema";
import { log } from "console";

export const boardsRouter: Router = express.Router();

boardsRouter.get(
  "/",
  validate(boardGetRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
  
    const {body} = boardGetRequestSchema.parse(req);
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
      const board = await createBoard(body);
      return res
        .status(201)
        .json({ message: "Board created successfully", success: true, board });
    } catch (error) {
      next(error);
    }
  }
);
