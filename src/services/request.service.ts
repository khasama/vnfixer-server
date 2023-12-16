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
  getAllWithPagination(
    filter,
    option: PaginationOptions
  ): Promise<PaginationProps>;
  findOne(filter): Promise<RequestDto>;
  getOne(id: number): Promise<RequestDto>;
  create(userId: number, requestDto: RequestDto): Promise<RequestDto>;
  update(id: number, requestDto: RequestDto): Promise<RequestDto>;
  changeStatus(id: number, status: RequestStatus): Promise<RequestDto>;
}

class RequestServive implements IRequestService {
  private requestModel = Request;
  private branchService = branchService;
  private categoryService = categoryService;

  async getAll(): Promise<Request[]> {
    const requests = await this.requestModel.findAll({
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
    return requests;
  }

  async getAllWithPagination(
    filter,
    option: PaginationOptions
  ): Promise<PaginationProps> {
    const skip = (option.page - 1) * option.limit;
    const { count } = await this.requestModel.findAndCountAll();
    const requests = await this.requestModel.findAll({
      where: filter,
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
    const requestsMapped = requests.map((request) => {
      return {
        ...request.toJSON(),
        expectDate: request.expectDate.split(","),
      } as RequestDto;
    });
    return { entries: requestsMapped, total: count };
  }

  async findOne(filter): Promise<RequestDto> {
    const request = await this.requestModel.findOne({
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
      raw: true,
    });
    return {
      ...request,
      expectDate: request.expectDate.split(","),
    } as RequestDto;
  }

  async getOne(filter): Promise<RequestDto> {
    const request = await this.findOne(filter);
    if (!request) {
      throw createHttpError.NotFound("Request not found");
    }
    return request;
  }

  async create(userId: number, requestDto: RequestDto): Promise<RequestDto> {
    await this.categoryService.getOne(requestDto.categoryId);
    const newRequest = await this.requestModel.create({
      ...toData(requestDto),
      expectDate: Array.isArray(requestDto.expectDate)
        ? requestDto.expectDate.join(",")
        : requestDto.expectDate,
      userId,
    });
    return await this.getOne({ id: newRequest.id });
  }

  async update(id: number, requestDto: RequestDto): Promise<RequestDto> {
    await this.categoryService.getOne(requestDto.categoryId);
    const [count] = await this.requestModel.update(
      {
        ...toData(requestDto),
        expectDate: Array.isArray(requestDto.expectDate)
          ? requestDto.expectDate.join(",")
          : requestDto.expectDate,
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

  async changeStatus(id: number, status: RequestStatus): Promise<RequestDto> {
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

  async takeRequest(branchId: number, requestId: number) {
    if (!branchId || !requestId) {
      throw createHttpError.BadRequest("Missing param(s)");
    }
    const request = await this.getOne({ id: requestId });
    if (request.status !== RequestStatus.PENDING) {
      throw createHttpError.BadRequest("Request not available");
    }
    const dataUpdate = {
      ...request,
      status: RequestStatus.ACCEPT,
      branchId,
    };
    await this.update(requestId, dataUpdate);
  }
}

export const requestService = new RequestServive();
