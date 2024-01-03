import { Request, Response } from "express";
import { userService } from "../services/users.service";
import { catchAsync } from "../utils/catch-async";
import { User } from "../models";
import { HttpError, StaffRequestStatus } from "../constants";
import { BaseRespone } from "../utils/base-respone";

class UserController {
  private _service = userService;

  getAll = catchAsync(async (req: Request, res: Response) => {
    const result = await this._service.getAll();
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  findWithEmail = catchAsync(async (req: Request, res: Response) => {
    const email = req.query.email as string;
    const result = await this._service.findWithEmail(email);
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  updateInfo = catchAsync(async (req: Request, res: Response) => {
    const user: User = req["user"];
    const result = await this._service.updateInfo(user.id, req.body);
    return res.status(HttpError.SUCCESS).json(result);
  });

  staffRequest = catchAsync(async (req: Request, res: Response) => {
    const user: User = req["user"];
    const action = req.query.action as StaffRequestStatus;
    const { requestId } = req.body;
    await this._service.staffRequest(user.id, parseInt(requestId), action);
    const respone = new BaseRespone("success", HttpError.SUCCESS);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  allStaffRequest = catchAsync(async (req: Request, res: Response) => {
    const user: User = req["user"];
    const result = await this._service.allStaffRequest(user.id);
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  updateNotiToken = catchAsync(async (req: Request, res: Response) => {
    const user: User = req["user"];
    const { token } = req.body;
    const result = await this._service.updateNotiToken(
      user.id,
      token as string
    );
    return res.status(HttpError.SUCCESS).json(result);
  });
}

export const userController = new UserController();
