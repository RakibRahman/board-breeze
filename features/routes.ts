import express, { Router, Request, Response } from "express";
import { usersRoute } from "./users/users.route";
import { initializeDatabase } from "../db/db";
import { boardsRouter } from "./boards/boards.route";
import { verifyToken } from "../middlewares/verify-token.middleware";

const ROUTE_PATHS = {
  TASKS: "/tasks",
  BOARDS: "/boards",
  USERS: "/users",
  COMMENTS: "/comments",
  ATTACHMENTS: "/attachments",
  ADMINS: "/admins",
};

const API_VERSION = "/api";

const apiRouter: Router = express.Router();

apiRouter.use(ROUTE_PATHS.USERS, usersRoute);
apiRouter.use(ROUTE_PATHS.BOARDS, verifyToken, boardsRouter);

export const routes: Router = express.Router();

routes.use(API_VERSION, apiRouter);

routes.get("/setup", async (req: Request, res: Response) => {
  await initializeDatabase()
    .then(() => {
      res.json({
        status: 200,
        message: "Successfully Database initialized",
      });
    })
    .catch((error) => {
      res.json({
        status: 500,
        message: "Database setup failed",
        error,
      });
    });
});
