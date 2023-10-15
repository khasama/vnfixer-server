import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { LoginDto } from "../dtos/auth/login.dto";
import { RegisterDto } from "../dtos/auth/register.dto";
import { catchAsync } from "../utils/catch-async";

class AuthController {
  private _service = authService;

  login = catchAsync(async (req: Request, res: Response) => {
    const body: LoginDto = req.body;
    const result = await this._service.login(body);
    return res.status(200).json(result);
  });

  register = catchAsync(async (req: Request, res: Response) => {
    const body: RegisterDto = req.body;
    const result = await this._service.register(body);
    return res.status(200).json(result);
  });

  logout = catchAsync(async (req: Request, res: Response) => {});
}

export const authController = new AuthController();
