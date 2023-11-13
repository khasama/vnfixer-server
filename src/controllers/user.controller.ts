import { Request, Response } from "express";
import { userService } from "../services/users.service";
import { catchAsync } from "../utils/catch-async";

class UserController {
  private _service = userService;

  getAll = catchAsync(async (req: Request, res: Response) => {
    const result = await this._service.getAll();
    return res.status(200).json(result);
  });
}

export const userController = new UserController();
