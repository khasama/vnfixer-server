import { Request, Response } from "express";
import { userService } from "../services/user/UserService";

class UserController {
  private _service = userService;

  getAll = async (req: Request, res: Response) => {
    try {
      const result = await this._service.getAll();
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  };
}

export const userController = new UserController();
