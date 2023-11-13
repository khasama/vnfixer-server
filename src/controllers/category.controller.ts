import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { categoryService } from "../services/category.service";
import { BaseRespone } from "../utils/base-respone";
import { HttpError } from "../constants";

class CategoryController {
  private _service = categoryService;

  getAll = catchAsync(async (req: Request, res: Response) => {
    const result = await this._service.getAll();
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
    const category = req.body;
    const result = await this._service.create(category);
    const respone = new BaseRespone("success", HttpError.CREATED, result);
    return res.status(HttpError.CREATED).json(respone);
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = req.body;
    const result = await this._service.update(parseInt(id), category);
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });
}

export const categoryController = new CategoryController();
