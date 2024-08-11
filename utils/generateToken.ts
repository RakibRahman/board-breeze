import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../features/users/users.schema";
import { ONE_HR } from "../features/constant";

export type JwtTokenPayload ={id:string} & Omit<User, "password">;
dotenv.config();
const env = process.env;

export const generateJWT = (payload: JwtTokenPayload, expiresIn = ONE_HR) => {
  return jwt.sign(payload, env.JWT_SECRET!, { expiresIn });
};
