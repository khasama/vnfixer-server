import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BaseRespone } from "../utils/base-respone";
import { HttpError, RequestStatus } from "../constants";
import { requestService } from "../services/request.service";
import { UserDto } from "../dtos/user/user.dto";

class RequestController {
  private _service = requestService;

  getAll = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(String(req.query.page)) || 1;
    const limit = parseInt(String(req.query.limit)) || 10;
    const sort = String(req.query.page);
    const result = await this._service.getAllWithPagination({
      page,
      limit,
      sort,
    });
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });

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

  changeStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const status = req.query.status as RequestStatus;
    const result = await this._service.changeStatus(parseInt(id), status);
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });
}

export const requestController = new RequestController();
