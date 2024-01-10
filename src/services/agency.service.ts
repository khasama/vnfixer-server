import { Agency, Branch, Category, Rating, Request, User } from "../models";
import { toData } from "../common/mappers";
import createHttpError from "http-errors";
import { AgencyDto } from "../dtos/agency/agency.dto";
import { categoryService } from "./category.service";
import {
  AgencyRoleType,
  PaginationOptions,
  PaginationProps,
  RequestStatus,
} from "../constants";
import { Op, Sequelize, where } from "sequelize";
import { UserDto } from "../dtos/user/user.dto";
import { userService } from "./users.service";
import { BranchDto } from "../dtos/branch/branch.dto";
import { genVnpayUrl } from "../utils/genVnpayUrl";

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
      ],
    });

    return { agency, requests };
  }

  async agencyPayment(
    id: number,
    userId: number,
    requestIds: number[],
    ipAddr,
    bankCode: string = ""
  ) {
    const agency = await this.agencyModel.findOne({ where: { id } });
    if (!agency) {
      throw new createHttpError.BadRequest("Agency not exist !!!");
    }
    if (agency.ownerId !== userId) {
      throw new createHttpError.BadRequest("You not is owner of this agency");
    }

    const paymentUrl = genVnpayUrl(ipAddr, bankCode, 100000, "123");
    return paymentUrl;
  }
}

export const agencyService = new AgencyServive();
