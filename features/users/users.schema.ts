import { z } from "zod";

export const userDTO = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const userLoginPostSchema = z.object({
  body: userDTO.omit({ name: true }),
});

export const userRegisterPostSchema = z.object({
  body: userDTO,
});

export type User = z.infer<typeof userDTO>;
