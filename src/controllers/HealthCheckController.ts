import { Request, Response } from "express";
import { healthCheckService } from "../services/healthcheck/HealthCheckService";

class HealthCheckController {
  private _service = healthCheckService;

  default = async (req: Request, res: Response) => {
    const result = await this._service.default();
    return res.status(200).json(result);
  };
}

export const healthCheckController = new HealthCheckController();
