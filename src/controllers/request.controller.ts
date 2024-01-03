import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BaseRespone } from "../utils/base-respone";
import { HttpError, RequestStatus } from "../constants";
import { requestService } from "../services/request.service";
import { UserDto } from "../dtos/user/user.dto";
import { User } from "../models";

class RequestController {
  private _service = requestService;

  getAll = catchAsync(async (req: Request, res: Response) => {
    const options = {
      page: parseInt(String(req.query.page)) || 1,
      limit: parseInt(String(req.query.limit)) || 10,
      sort: String(req.query.page),
    };
    const filter = {
      branchId: null,
    };
    if (req.query.city) {
      filter["city"] = req.query.city;
    }
    if (req.query.status) {
      filter["status"] = req.query.status;
    }
    if (req.query.category) {
      filter["categoryId"] = parseInt(String(req.query.category));
    }
    if (req.query.branchId) {
      filter["branchId"] = parseInt(String(req.query.branchId));
    }
    const result = await this._service.getAllWithPagination(filter, options);
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
    const user: User = req["user"];
    const status = req.query.status as RequestStatus;
    const result = await this._service.changeStatus(user, parseInt(id), status);
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  takeRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user: User = req["user"];
    await this._service.takeRequest(user, parseInt(id));
    const respone = new BaseRespone("success", HttpError.SUCCESS);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  pickRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user: User = req["user"];
    await this._service.pickRequest(user, parseInt(id));
    const respone = new BaseRespone("success", HttpError.SUCCESS);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  myRequests = catchAsync(async (req: Request, res: Response) => {
    const user: User = req["user"];
    const result = await this._service.myRequest(user.id);
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  requestToTake = catchAsync(async (req: Request, res: Response) => {
    const user: User = req["user"];
    const result = await this._service.requestToTake(user);
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  requestTaked = catchAsync(async (req: Request, res: Response) => {
    const user: User = req["user"];
    const result = await this._service.requestTaked(user);
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });
}

export const requestController = new RequestController();
