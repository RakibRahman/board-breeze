import { log } from "console";
import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../features/users/users.schema";
import { JwtTokenPayload } from "../utils/generateToken";
import { CustomError } from "../models/error";
dotenv.config();
const env = process.env;

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) {
    throw new CustomError("Unauthorized: Please log in.",401);
  }

  try {
    const decodedToken = jwt.verify(token, env.JWT_SECRET!) as JwtTokenPayload;

    if (decodedToken.id) {
      next();
    }
  } catch (err) {
    console.error("Failed to verify token:", err);
    res.status(401).send({ message: "Unauthorized" });
  }
};
