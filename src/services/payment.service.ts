import createHttpError from "http-errors";
import { Agency, Branch, Payment, Request } from "../models";
import { checkVnpayPayment } from "../utils/vnpay";
import { RATE_PER_REQUEST, RequestStatus } from "../constants";

interface IPaymentService {}

class PaymentServive implements IPaymentService {
  private requestModel = Request;
  private agencyModel = Agency;
  private paymentModel = Payment;

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
    const requests = await this.requestModel.findAll({
      where: {
        status: RequestStatus.PAYMENT_PENDING,
      },
      include: [
        {
          model: Branch,
          as: "branch",
          where: {
            agencyId: agency.id,
          },
        },
      ],
    });
    const requestIds = requests.map((request) => request.id);
    const [affectedCount] = await this.requestModel.update(
      {
        status: paymentSucess ? RequestStatus.PAID : RequestStatus.DONE,
      },
      {
        where: {
          id: requestIds,
        },
      }
    );
    await this.paymentModel.create({
      userId,
      agencyId,
      total: affectedCount * RATE_PER_REQUEST,
    });
    return {
      paymentStatus: paymentSucess ? "success" : "failed",
      message: paymentSucess ? "Thanh toán thành công" : "Thanh toán thất bại",
    };
  }
}

export const PaymentService = new PaymentServive();
