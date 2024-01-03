import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { seedService } from "../services/seed.service";

class SeedController {
  private _service = seedService;

  seed = catchAsync(async (req: Request, res: Response) => {
    const result = await this._service.seed();
    return res.status(200).json(result);
  });
}

export const seedController = new SeedController();
