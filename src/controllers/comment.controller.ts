import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { User } from "../models";
import { BaseRespone } from "../utils/base-respone";
import { HttpError } from "../constants";
import { CommentService } from "../services/comment.service";

class CommentController {
  private _service = CommentService;

  getCommentsOfAgency = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this._service.getCommentsOfAgency(parseInt(id));
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(200).json(respone);
  });

  create = catchAsync(async (req: Request, res: Response) => {
    const user: User = req["user"];
    const data = req.body;
    await this._service.create(user.id, data);
    const respone = new BaseRespone("success", HttpError.SUCCESS);
    return res.status(200).json(respone);
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const user: User = req["user"];
    const { id } = req.params;
    await this._service.delete(user.id, parseInt(id));
    const respone = new BaseRespone("success", HttpError.SUCCESS);
    return res.status(200).json(respone);
  });
}

export const commentController = new CommentController();
