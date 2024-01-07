import * as fs from "fs";
import * as path from "path";
const { NlpManager } = require("node-nlp");
import { Agency, Branch, Category, User } from "../models";
import { CategoryKey, ChatbotIntent, Intent } from "../constants";

interface IChatbotService {}

class ChatbotServive implements IChatbotService {
  private userModel = User;
  private categoryModel = Category;
  private agencyModel = Agency;
  private readonly manager;
  constructor() {
    const data = fs.readFileSync(
      path.join(__dirname, "../nlp/model.nlp"),
      "utf8"
    );
    this.manager = new NlpManager();
    this.manager.import(data);
  }

  async ask(question: string) {
    const result = await this.manager.process(
      "vi",
      question.toLocaleLowerCase()
    );
    const { intent, answer }: { intent: ChatbotIntent; answer: string } =
      result;
    const response = {
      question,
      answer,
      data: null,
      type: "text",
      canDetect: true,
    };
    if ((Object.values(CategoryKey) as string[]).includes(intent)) {
      response.data = await this.getTopAgencies(intent);
      response.type = "agencies";
    }
    if (intent === Intent.LIST_CATEGORIES) {
      response.data = await this.getAllCategory();
      response.type = "categories";
    }
    if (intent === Intent.NONE) {
      response.answer =
        "Xin lỗi, chủ đề này nằm ngoài sự hiểu biết của tôi, bạn có thể đưa ra câu hỏi khác không?";
      response.canDetect = false;
    }
    return response;
  }

  async getTopAgencies(intent: ChatbotIntent) {
    const category = await this.categoryModel.findOne({
      where: {
        key: intent,
      },
    });
    if (!category) {
      return null;
    }
    const agencies = await this.agencyModel.findAll({
      where: {
        categoryId: category.id,
      },
      include: [
        {
          model: Branch,
          as: "branches",
        },
      ],
      limit: 3,
    });
    return agencies;
  }

  async getAllCategory() {
    const categories = await this.categoryModel.findAll();
    if (categories.length === 0) {
      return null;
    }
    return categories;
  }
}

export const chatbotService = new ChatbotServive();
