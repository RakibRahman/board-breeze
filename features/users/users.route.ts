import express, { NextFunction, Request, Response, Router } from "express";
import { validate } from "../../middlewares/validation.middleware";
import { generateJWT } from "../../utils/generateToken";
import { userLoginPostSchema, userRegisterPostSchema } from "./users.schema";
import { userLogin, userRegistration } from "./users.service";
import { ONE_HR } from "../constant";

const cookieConfig = {
  httpOnly: true,
  maxAge: ONE_HR,
};

export const usersRoute: Router = express.Router();

usersRoute.post(
  "/login",
  validate(userLoginPostSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = userLoginPostSchema.parse(req);

    try {
      const data = await userLogin(body);
      data &&
        res
          .cookie("access_token", data.token, cookieConfig)
          .status(200)
          .json({ success: true, message: "Logged in successfully" });
    } catch (error) {
      res.status(401);
      next(error);
    }
  }
);

usersRoute.post(
  "/register",
  validate(userRegisterPostSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = userRegisterPostSchema.parse(req);

    try {
      const user = await userRegistration(body);
      const token = generateJWT(user);
      user &&
        res
          .cookie("access_token", token, cookieConfig)
          .status(201)
          .json({ success: true, message: "Account created successfully!" });
    } catch (error) {
      next(error);
    }
  }
);

