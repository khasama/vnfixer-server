import { NextFunction, Request, Response } from "express";
import { authSchema } from "../utils/joi.schema";
import Joi from "joi";

function validate(schema: Joi.ObjectSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }
    next();
  };
}

export const authValidate = validate(authSchema);
