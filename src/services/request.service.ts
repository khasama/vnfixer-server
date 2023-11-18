import {
  PaginationOptions,
  PaginationProps,
  RequestStatus,
} from "../constants";
import { RequestDto } from "../dtos/request/request.dto";
import { Branch, Category, Request } from "../models";
import { toData } from "../common/mappers";
import createHttpError from "http-errors";
import { branchService } from "./branch.service";
import { categoryService } from "./category.service";

interface IRequestService {
  getAll(): Promise<Request[]>;
  getAllWithPagination(option: PaginationOptions): Promise<PaginationProps>;
  findOne(filter): Promise<Request>;
  getOne(id: number): Promise<Request>;
  create(userId: number, requestDto: RequestDto): Promise<Request>;
  update(id: number, requestDto: RequestDto): Promise<Request>;
  changeStatus(id: number, status: RequestStatus): Promise<Request>;
}

class RequestServive implements IRequestService {
  private requestModel = Request;
  private branchService = branchService;
  private categoryService = categoryService;

  async getAll(): Promise<Request[]> {
    const agencies = await this.requestModel.findAll({
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
    return agencies;
  }

  async getAllWithPagination(
    option: PaginationOptions
  ): Promise<PaginationProps> {
    const skip = (option.page - 1) * option.limit;
    const { count } = await this.requestModel.findAndCountAll();
    const agencies = await this.requestModel.findAll({
      limit: option.limit,
      offset: skip,
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
    return { entries: agencies, total: count };
  }

  async findOne(filter): Promise<Request> {
    const agency = await this.requestModel.findOne({
      where: filter,
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
    return agency;
  }

  async getOne(filter): Promise<Request> {
    const request = await this.findOne(filter);
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
    return await this.getOne({ id: newRequest.id });
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
    return await this.getOne({ id });
  }

  async changeStatus(id: number, status: RequestStatus): Promise<Request> {
    if (!Object.values(RequestStatus).includes(status)) {
      throw createHttpError.BadRequest("Status invalid");
    }
    const [count] = await this.requestModel.update(
      {
        status,
      },
      {
        where: {
          id,
        },
      }
    );
    if (count === 0) {
      throw createHttpError.NotFound("Not found");
    }
    return await this.getOne({ id });
  }
}

export const requestService = new RequestServive();
