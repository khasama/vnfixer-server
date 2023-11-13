import { IRequest } from "../constants";
import { RequestDto } from "../dtos/request/request.dto";
import { Branch, Category, Request } from "../models";
import { toData } from "../common/mappers";
import createHttpError from "http-errors";
import { branchService } from "./branch.service";
import { categoryService } from "./category.service";

interface IRequestService {
  getOne(id: number): Promise<Request>;
  create(userId: number, requestDto: RequestDto): Promise<Request>;
  update(id: number, requestDto: RequestDto): Promise<Request>;
}

class RequestServive implements IRequestService {
  private requestModel = Request;
  private branchService = branchService;
  private categoryService = categoryService;

  async getOne(id: number): Promise<Request> {
    const request = await this.requestModel.findOne({
      where: { id },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "description"],
        },
        {
          model: Branch,
          as: "branch",
        },
      ],
    });
    if (!request) {
      throw createHttpError.NotFound("Request not found");
    }
    return request;
  }

  async create(userId: number, requestDto: RequestDto): Promise<Request> {
    await this.categoryService.getOne(requestDto.categoryId);
    const newRequest = await this.requestModel.create({
      ...toData(requestDto),
      userId,
    });
    return await this.getOne(newRequest.id);
  }

  async update(id: number, requestDto: RequestDto): Promise<Request> {
    await this.categoryService.getOne(requestDto.categoryId);
    const [count] = await this.requestModel.update(toData(requestDto), {
      where: {
        id,
      },
    });
    if (count === 0) {
      throw createHttpError.NotFound("Not found");
    }
    return await this.getOne(id);
  }
}

export const requestService = new RequestServive();
