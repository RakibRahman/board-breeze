import { NextFunction, Request, Response } from "express";
import { CustomError } from "../models/types";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  const errCode = err.statusCode || 500;
  const errMsg = err.message || "Something went wrong";

  res.status(errCode).json({
    message: errMsg,
    status: errCode,
    success: false,
  });
};
