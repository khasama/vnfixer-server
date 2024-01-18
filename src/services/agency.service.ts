import { Agency, Branch, Category, Rating, Request, User } from "../models";
import { toData } from "../common/mappers";
import createHttpError from "http-errors";
import { AgencyDto } from "../dtos/agency/agency.dto";
import { categoryService } from "./category.service";
import {
  AgencyRoleType,
  IRequest,
  IUser,
  MIN_TOTAL,
  PaginationOptions,
  PaginationProps,
  RATE_PER_REQUEST,
  RequestStatus,
} from "../constants";
import { Op } from "sequelize";
import { UserDto } from "../dtos/user/user.dto";
import { userService } from "./users.service";
import { BranchDto } from "../dtos/branch/branch.dto";
import { genVnpayUrl } from "../utils/vnpay";

interface IAgencyService {
  getAll(): Promise<Agency[]>;
  getAllWithPagination(
    filter,
    brandFilter,
    option: PaginationOptions
  ): Promise<PaginationProps>;
  findOne(filter): Promise<Agency>;
  getOne(filter): Promise<Agency>;
  create(agencyDto: AgencyDto, user: UserDto, branch: BranchDto);
  update(id: number, agencyDto: AgencyDto): Promise<Agency>;
}

class AgencyServive implements IAgencyService {
  private agencyModel = Agency;
  private branchModel = Branch;
  private requestModel = Request;
  private categoryService = categoryService;
  private userService = userService;

  async getAll(): Promise<Agency[]> {
    const agencies = await this.agencyModel.findAll({
      include: [
        {
          model: Category,
          as: "categories",
          attributes: ["id", "name", "description"],
        },
        {
          model: Branch,
          as: "branches",
        },
      ],
    });
    return agencies;
  }

  async getAllWithPagination(
    filter,
    brandFilter,
    option: PaginationOptions
  ): Promise<PaginationProps> {
    const skip = (option.page - 1) * option.limit;
    const brandInclude = {
      model: Branch,
      as: "branches",
      include: [
        {
          model: Request,
          attributes: ["id"],
          as: "requests",
          where: {
            status: RequestStatus.DONE,
          },
          required: false,
        },
      ],
    };
    if (brandFilter["city"]) {
      brandInclude["where"] = brandFilter;
    }
    const queryFilter = {
      where: filter,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "description"],
        },
        brandInclude,
      ],
    };
    const count = (await this.agencyModel.findAll(queryFilter)).length;
    const agencies = await this.agencyModel.findAll({
      ...queryFilter,
      limit: option.limit,
      offset: skip,
    });
    return { entries: agencies, total: count };
  }

  async findOne(filter): Promise<Agency> {
    const agency = await this.agencyModel.findOne({
      where: filter,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "description"],
        },
        {
          model: Rating,
          as: "ratings",
          attributes: ["id", "rating"],
        },
        {
          model: Branch,
          as: "branches",
          include: [
            {
              model: Request,
              attributes: ["id", "status"],
              as: "requests",
              where: {
                status: {
                  [Op.or]: [RequestStatus.DONE, RequestStatus.ACCEPT],
                },
              },
              required: false,
            },
            {
              model: User,
              attributes: ["id"],
              as: "users",
              required: false,
            },
          ],
        },
      ],
    });
    return agency;
  }

  async getOne(filter): Promise<Agency> {
    const agency = await this.findOne(filter);
    if (!agency) {
      throw createHttpError.NotFound("Agency not found");
    }
    return agency;
  }

  async create(agencyDto: AgencyDto, user: UserDto, branch: BranchDto) {
    if (user.branchId && user.agencyRole) {
      throw new createHttpError.BadRequest(
        "Current user already in branch !!!"
      );
    }
    const agency = await this.findOne({ name: agencyDto.name });
    if (agency) {
      throw new createHttpError.BadRequest("Agency name exist !!!");
    }

    const newAgency = await this.agencyModel.create({
      ...toData(agencyDto),
      ownerId: user.id,
    });
    if (branch) {
      const newBranch = await this.branchModel.create({
        agencyId: newAgency.id,
        ...branch,
      });
      await this.userService.updateAgencyStaff(
        newBranch.id,
        AgencyRoleType.MANAGER,
        user.id
      );
    }
    return await this.getOne({ id: newAgency.id });
  }

  async update(id: number, agencyDto: AgencyDto): Promise<Agency> {
    const agency = await this.findOne({
      name: agencyDto.name,
      id: { [Op.ne]: id },
    });
    if (agency) {
      throw new createHttpError.BadRequest("Agency name exist !!!");
    }
    await this.categoryService.getOne(agencyDto.categoryId);
    const [count] = await this.agencyModel.update(toData(agencyDto), {
      where: {
        id,
      },
    });
    if (count === 0) {
      throw createHttpError.NotFound("Not found");
    }
    const agencyUpdated = await this.getOne({ id });
    return agencyUpdated;
  }

  async getPaymentInfo(id: number, userId: number) {
    const agency = await this.agencyModel.findOne({ where: { id } });
    if (!agency) {
      throw new createHttpError.BadRequest("Agency not exist !!!");
    }
    if (agency.ownerId !== userId) {
      throw new createHttpError.BadRequest("You not is owner of this agency");
    }
    const requests = await this.requestModel.findAll({
      where: {
        status: RequestStatus.DONE,
      },
      include: [
        {
          model: Branch,
          as: "branch",
          where: {
            agencyId: agency.id,
          },
        },
        {
          model: User,
          as: "staff",
          attributes: ["id", "email"],
        },
      ],
    });

    return { agency, requests };
  }

  async agencyPayment(
    id: number,
    user: IUser,
    requestIds: number[],
    ipAddr,
    bankCode: string = "",
    returnUrl: string
  ) {
    const agency = await this.agencyModel.findOne({ where: { id } });
    if (!agency) {
      throw new createHttpError.BadRequest("Agency not exist !!!");
    }
    if (agency.ownerId !== user.id) {
      throw new createHttpError.BadRequest("You not is owner of this agency");
    }

    const requests = await this.requestModel.findAll({
      where: {
        status: RequestStatus.DONE,
      },
      include: [
        {
          model: Branch,
          as: "branch",
          where: {
            agencyId: agency.id,
          },
        },
      ],
    });

    const allRequestValid = this.checkRequestsValid(requests, requestIds);
    if (!allRequestValid) {
      throw new createHttpError.BadRequest("One of list invalid");
    }
    const total = requestIds.length * RATE_PER_REQUEST;
    if (total < MIN_TOTAL) {
      throw new createHttpError.BadRequest(
        `Min amount must be than ${MIN_TOTAL}`
      );
    }

    await this.changeRequestsToPaymentProcess(requestIds);

    const paymentDescription = `Người dùng ${user.email} đã thanh toán ${total} của ${requestIds.length} yêu cầu cho đại lý ${agency.name}`;

    const paymentUrl = genVnpayUrl(
      ipAddr,
      bankCode,
      total,
      paymentDescription,
      returnUrl
    );
    return paymentUrl;
  }

  checkRequestsValid(requests: IRequest[], requestIds: number[]) {
    const requestsFind: number[] = [];
    for (const id of requestIds) {
      if (requests.find((request) => request.id === id)) {
        requestsFind.push(id);
      }
    }
    return requestsFind.length === requestIds.length;
  }

  async changeRequestsToPaymentProcess(requestIds: number[]) {
    const [affectedCount] = await this.requestModel.update(
      {
        status: RequestStatus.PAYMENT_PENDING,
      },
      {
        where: {
          id: requestIds,
        },
      }
    );
    if (affectedCount !== requestIds.length) {
      throw new createHttpError.BadRequest("chaneg status error");
    }
  }
}

export const agencyService = new AgencyServive();
