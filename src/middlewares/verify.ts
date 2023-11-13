import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { validateAccessToken } from "../utils/jwt";

export function verifyUser() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: string = req.headers.authorization;
      if (!token) {
        return next(createHttpError.Unauthorized("Missing token"));
      }

      token = token.split(" ").pop();

      const payload = await validateAccessToken(token);
      req["user"] = payload;
      next();
    } catch (error) {
      next(createHttpError.Unauthorized("Something went wrong !!!"));
    }
  };
}
