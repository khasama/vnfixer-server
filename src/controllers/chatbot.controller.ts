import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { chatbotService } from "../services/chatbot.service";

class ChatbotController {
  private _service = chatbotService;

  ask = catchAsync(async (req: Request, res: Response) => {
    const { question } = req.body;
    const result = await this._service.ask(question);
    return res.status(200).json(result);
  });
}

export const chatbotController = new ChatbotController();
