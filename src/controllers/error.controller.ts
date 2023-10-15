import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

class ErrorController {
  error = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.status || 400).json({
      message: err.message,
    });
  };
}

export const errorController = new ErrorController();
