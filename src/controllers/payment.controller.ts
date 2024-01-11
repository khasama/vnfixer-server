import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { HttpError } from "../constants";
import { BaseRespone } from "../utils/base-respone";
import { PaymentService } from "../services/payment.service";

class PaymentController {
  private _service = PaymentService;

  checkPaymentResult = catchAsync(async (req: Request, res: Response) => {
    const { id: agencyId } = req.params;
    const { id: userId } = req["user"];
    const paymentPayload: Record<any, any> = req.query;
    const result = await this._service.checkPaymentResult(
      parseInt(agencyId),
      parseInt(userId),
      paymentPayload
    );
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(HttpError.SUCCESS).json(respone);
  });
}

export const paymentController = new PaymentController();
