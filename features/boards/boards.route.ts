import express, { NextFunction, Request, Response, Router } from "express";
import { getUserBoards } from "./boards.service";

export const boardsRouter: Router = express.Router();

boardsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.id;
    console.log({payload:req.body})
    try {
      const boardList = await getUserBoards(userId,req.body.onlyMe,req.body.sortBy,req.body.query);
      return res.status(201).json(boardList);
    } catch (error) {
      next(error);
    }
  }
);
