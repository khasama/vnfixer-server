import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BaseRespone } from "../utils/base-respone";
import { HttpError } from "../constants";
import { agencyService } from "../services/agency.service";

class AgencyController {
  private _service = agencyService;

  getAll = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(String(req.query.page)) || 1;
    const limit = parseInt(String(req.query.limit)) || 10;
    const sort = String(req.query.page);
    const filter = {};
    const brandFilter = {};
    if (req.query.categoryId) {
      filter["categoryId"] = parseInt(String(req.query.categoryId));
    }
    if (req.query.city) {
      brandFilter["city"] = String(req.query.city);
    }
    const result = await this._service.getAllWithPagination(
      filter,
      brandFilter,
      {
        page,
        limit,
        sort,
      }
    );
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
    const agency = req.body;
    const branch = agency.branch;
    delete agency.branch;
    const user = req["user"];
    const result = await this._service.create(agency, user, branch);
    const respone = new BaseRespone("success", HttpError.CREATED, result);
    return res.status(HttpError.CREATED).json(respone);
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const agency = req.body;
    const result = await this._service.update(parseInt(id), agency);
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  getPaymentInfo = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { id: userId } = req["user"];
    const result = await this._service.getPaymentInfo(parseInt(id), userId);
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });

  agencyPayment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { id: userId } = req["user"];
    const { requestIds, bankCode, returnUrl } = req.body;
    const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const result = await this._service.agencyPayment(
      parseInt(id),
      userId,
      requestIds as number[],
      ipAddr,
      bankCode as string,
      returnUrl as string
    );
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });
}

export const agencyController = new AgencyController();
