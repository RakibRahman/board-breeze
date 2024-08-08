import { AnyZodObject } from "zod";
import { NextFunction, Request, Response } from "express";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { params, query, body } = req;
    const validateRequest = await schema.safeParseAsync({
      body,
      query,
      params,
    });

    if (validateRequest.success) {
      return next();
    }

    if (validateRequest.error) {
      const issues = validateRequest.error.issues;
      res.status(400).json({
        message: "Validation Failed!",
        details: issues.map((issue) => ({
          path: issue.path.join(": "),
          message: issue.message,
        })),
      });
    }
  };
