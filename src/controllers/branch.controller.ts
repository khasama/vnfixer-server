import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BaseRespone } from "../utils/base-respone";
import { HttpError } from "../constants";
import { branchService } from "../services/branch.service";

class BranchController {
  private _service = branchService;

  getOne = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this._service.getOne(parseInt(id));
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  create = catchAsync(async (req: Request, res: Response) => {
    const branch = req.body;
    const result = await this._service.create(branch);
    const respone = new BaseRespone("success", HttpError.CREATED, result);
    return res.status(HttpError.CREATED).json(respone);
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const branch = req.body;
    const result = await this._service.update(parseInt(id), branch);
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  addStaff = catchAsync(async (req: Request, res: Response) => {
    const { branchId } = req["user"];
    const { userId, role } = req.body;
    await this._service.addStaff(parseInt(branchId), parseInt(userId), role);
    const respone = new BaseRespone("success", HttpError.SUCCESS);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  removeStaff = catchAsync(async (req: Request, res: Response) => {
    const { branchId } = req["user"];
    const { id } = req.params;
    await this._service.removeStaff(parseInt(branchId), parseInt(id));
    const respone = new BaseRespone("success", HttpError.SUCCESS);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  allStaffs = catchAsync(async (req: Request, res: Response) => {
    const { branchId } = req["user"];
    const result = await this._service.getAllStaffs(parseInt(branchId));
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });
}

export const branchController = new BranchController();
