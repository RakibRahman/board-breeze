import express, { NextFunction, Request, Response, Router } from "express";
import { validate } from "../../middlewares/validation.middleware";
import { idUUIDRequestSchema } from "../../models/schema";
import { generateJWT } from "../../utils/generateToken";
import { ONE_HR } from "../constant";
import { userLoginPostSchema, userRegisterPostSchema } from "./users.schema";
import { getUserDetails, userLogin, userRegistration } from "./users.service";
import { log } from "console";

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

usersRoute.get(
  "/:id",
  validate(idUUIDRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { params } = idUUIDRequestSchema.parse(req);
    const user = await getUserDetails(params.id);
    user
      ? res.json({ data: user, success: true })
      : res.status(404).json({ message: "Failed to get user details", success: false });
  }
);
