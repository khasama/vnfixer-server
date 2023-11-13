import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { BaseRespone } from "../utils/base-respone";

class ErrorController {
  error = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const respone = new BaseRespone(err.message, err.status || 400);
    return res.status(err.status || 400).json(respone);
  };
}

export const errorController = new ErrorController();
