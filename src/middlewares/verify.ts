import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { validateAccessToken } from "../utils/jwt";
import { AgencyRoleType } from "../constants";
import { User } from "../models";

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

export function verifyAgencyRole(role: AgencyRoleType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: string = req.headers.authorization;
      if (!token) {
        return next(createHttpError.Unauthorized("Missing token"));
      }
      token = token.split(" ").pop();
      const payload = (await validateAccessToken(token)) as User;
      if (payload.agencyRole !== role) {
        return next(createHttpError.Forbidden(`You are not ${role}`));
      }
      req["user"] = payload;
      next();
    } catch (error) {
      next(createHttpError.Unauthorized("Something went wrong !!!"));
    }
  };
}
