import createHttpError from "http-errors";
import { Agency, User } from "../models";
import { checkVnpayPayment } from "../utils/vnpay";

interface IPaymentService {}

class PaymentServive implements IPaymentService {
  private userModel = User;
  private agencyModel = Agency;

  async checkPaymentResult(
    agencyId: number,
    userId: number,
    paymentPayload: Record<any, any>
  ) {
    const agency = await this.agencyModel.findOne({ where: { id: agencyId } });
    if (!agency) {
      throw new createHttpError.BadRequest("Agency not exist !!!");
    }
    if (agency.ownerId !== userId) {
      throw new createHttpError.BadRequest("You not is owner of this agency");
    }

    const paymentSucess = checkVnpayPayment(paymentPayload);

    return {
      paymentStatus: paymentSucess ? "success" : "failed",
      message: paymentSucess ? "Thanh toán thành công" : "Thanh toán thất bại",
    };
  }
}

export const PaymentService = new PaymentServive();
