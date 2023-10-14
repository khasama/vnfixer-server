import { NextFunction, Response, Request } from "express";

export const catchAsync =
  (fn) => (req: Request, res: Response, next: NextFunction) => {
    const status: number = 400;
    Promise.resolve(fn(req, res, next)).catch((err) => {
      return res.status(status).json({ message: err.message });
    });
  };
