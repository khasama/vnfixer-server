import {
  AgencyRoleType,
  INotificationContent,
  PaginationOptions,
  PaginationProps,
  RequestStatus,
} from "../constants";
import { RequestDto } from "../dtos/request/request.dto";
import { Agency, Branch, Category, Request } from "../models";
import { toData } from "../common/mappers";
import createHttpError from "http-errors";
import { branchService } from "./branch.service";
import { categoryService } from "./category.service";
import { UserDto } from "../dtos/user/user.dto";
import { notificationService } from "./notification.service";

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
  changeStatus(user: UserDto, requestId: number, status: RequestStatus);
}

class RequestServive implements IRequestService {
  private requestModel = Request;
  private branchService = branchService;
  private categoryService = categoryService;
  private notificationService = notificationService;

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

  async changeStatus(user: UserDto, requestId: number, status: RequestStatus) {
    if (!Object.values(RequestStatus).includes(status)) {
      throw createHttpError.BadRequest("Status invalid");
    }
    const request = await this.getOne({ id: requestId });
    if (!user.branchId) {
      throw createHttpError.Forbidden("You are not staff");
    }
    if (
      user.agencyRole === AgencyRoleType.STAFF &&
      request.staffId !== user.id
    ) {
      throw createHttpError.Forbidden("This request not assign for you");
    }
    if (
      user.agencyRole === AgencyRoleType.MANAGER &&
      request.branchId &&
      request.branchId !== user.branchId
    ) {
      throw createHttpError.Forbidden(
        "You can not change status of this request"
      );
    }
    const [count] = await this.requestModel.update(
      {
        status,
      },
      {
        where: {
          id: requestId,
        },
      }
    );
    if (count === 0) {
      throw createHttpError.NotFound("Not found");
    }
    let notificationContent: INotificationContent;
    if (status === RequestStatus.DONE) {
      notificationContent = {
        title: "Yêu cầu của bạn đã được hoàn thành",
        body: `Yêu cầu sửa chữa: ${request.title} của bạn đã được hoàn thành`,
        data: {},
      };
    } else if (status === RequestStatus.CANCEL) {
      notificationContent = {
        title: "Yêu cầu của bạn đã bị hủy bỏ",
        body: `Yêu cầu sửa chữa: ${request.title} của bạn đã bị hủy bỏ`,
        data: {},
      };
    } else if (
      status === RequestStatus.PICKED ||
      status === RequestStatus.PENDING
    ) {
      notificationContent = {
        title: `Yêu cầu của bạn đã được chuyển về trạng thái ${status}`,
        body: `Yêu cầu sửa chữa: ${request.title} của bạn đã được chuyển về trạng thái ${status}`,
        data: {},
      };
    }

    await this.notificationService.send(request.userId, notificationContent);
  }

  async takeRequest(user: UserDto, requestId: number) {
    if (!user.branchId || !requestId) {
      throw createHttpError.BadRequest("Missing param(s)");
    }
    const requestTaked = await this.requestModel.findOne({
      where: {
        staffId: user.id,
        status: RequestStatus.ACCEPT,
      },
    });
    if (requestTaked) {
      throw createHttpError.BadRequest("Please done the request is processing");
    }
    const request = await this.requestModel.findOne({
      where: { id: requestId },
    });
    if (request.status !== RequestStatus.PICKED || request.staffId) {
      throw createHttpError.BadRequest("Request not available");
    }
    const dataUpdate = {
      ...request,
      status: RequestStatus.ACCEPT,
      branchId: user.branchId,
      staffId: user.id,
    };
    await this.update(requestId, dataUpdate);
    const notificationContent: INotificationContent = {
      title: "Yêu cầu của bạn đã được nhận",
      body: `Yêu cầu sửa chữa: ${request.title} của bạn đã được nhận bời một nhân viên của đại lý`,
      data: {},
    };
    await this.notificationService.send(request.userId, notificationContent);
    return this.requestToTake(user);
  }

  async pickRequest(user: UserDto, requestId: number) {
    if (!user.branchId || !requestId) {
      throw createHttpError.BadRequest("Missing param(s)");
    }
    const request = await this.requestModel.findOne({
      where: { id: requestId },
    });
    if (request.status !== RequestStatus.PENDING || request.branchId) {
      throw createHttpError.BadRequest("Request not available");
    }
    const dataUpdate = {
      ...request,
      status: RequestStatus.PICKED,
      branchId: user.branchId,
    };
    await this.update(requestId, dataUpdate);
    const notificationContent: INotificationContent = {
      title: "Yêu cầu của bạn đã được chọn",
      body: `Yêu cầu sửa chữa: ${request.title} của bạn đã được chọn bởi một đại lý sửa chữa`,
      data: {},
    };
    await this.notificationService.send(request.userId, notificationContent);
    return this.requestToTake(user);
  }

  async myRequest(id: number): Promise<RequestDto[]> {
    const requests = await this.requestModel.findAll({
      where: {
        userId: id,
      },
      include: [
        {
          model: Branch,
          as: "branch",
          include: [
            {
              model: Agency,
              as: "agency",
            },
          ],
        },
        {
          model: Category,
          as: "category",
        },
      ],
    });
    return requests;
  }

  async requestToTake(user: UserDto): Promise<RequestDto[]> {
    if (!user.branchId || !user.agencyRole) {
      throw createHttpError.Forbidden("You are not staff");
    }
    const requests = await this.requestModel.findAll({
      where: {
        branchId: user.branchId,
        status: RequestStatus.PICKED,
      },
      include: [
        {
          model: Branch,
          as: "branch",
          include: [
            {
              model: Agency,
              as: "agency",
            },
          ],
        },
        {
          model: Category,
          as: "category",
        },
      ],
    });
    return requests;
  }

  async requestTaked(user: UserDto): Promise<RequestDto> {
    if (!user.branchId || !user.agencyRole) {
      throw createHttpError.Forbidden("You are not staff");
    }
    const request = await this.requestModel.findOne({
      where: {
        branchId: user.branchId,
        status: RequestStatus.ACCEPT,
        staffId: user.id,
      },
      include: [
        {
          model: Branch,
          as: "branch",
          include: [
            {
              model: Agency,
              as: "agency",
            },
          ],
        },
        {
          model: Category,
          as: "category",
        },
      ],
    });
    return request;
  }
}

export const requestService = new RequestServive();
