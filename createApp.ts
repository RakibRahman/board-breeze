import cors from "cors";
import express, { Express } from "express";
import { routes } from "./features/routes";
import { notFoundHandler } from "./middlewares/not-found.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import cookieParser from 'cookie-parser';

export const createApp = () => {
  const app: Express = express();
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
    })
  );
  app.use(cookieParser());
  // register routes
  app.use(routes);

  //   register middlewares
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
