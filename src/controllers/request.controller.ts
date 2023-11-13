import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BaseRespone } from "../utils/base-respone";
import { HttpError } from "../constants";
import { requestService } from "../services/request.service";
import { UserDto } from "../dtos/user/user.dto";

class RequestController {
  private _service = requestService;

  getOne = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this._service.getOne(parseInt(id));
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  create = catchAsync(async (req: Request, res: Response) => {
    const request = req.body;
    const user = req["user"] as UserDto;
    const result = await this._service.create(user.id, request);
    const respone = new BaseRespone("success", HttpError.CREATED, result);
    return res.status(HttpError.CREATED).json(respone);
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const request = req.body;
    const result = await this._service.update(parseInt(id), request);
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });
}

export const requestController = new RequestController();
