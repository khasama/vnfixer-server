import { Agency, Branch, Category, Request, User } from "../models";
import { toData } from "../common/mappers";
import createHttpError from "http-errors";
import { AgencyDto } from "../dtos/agency/agency.dto";
import { categoryService } from "./category.service";
import {
  PaginationOptions,
  PaginationProps,
  RequestStatus,
} from "../constants";
import { Op, Sequelize, where } from "sequelize";

interface IAgencyService {
  getAll(): Promise<Agency[]>;
  getAllWithPagination(
    filter,
    brandFilter,
    option: PaginationOptions
  ): Promise<PaginationProps>;
  findOne(filter): Promise<Agency>;
  getOne(filter): Promise<Agency>;
  create(agencyDto: AgencyDto): Promise<Agency>;
  update(id: number, agencyDto: AgencyDto): Promise<Agency>;
}

class AgencyServive implements IAgencyService {
  private agencyModel = Agency;
  private categoryService = categoryService;

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
    const agency = await this.agencyModel.findOne({
      where: filter,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "description"],
        },
        {
          model: Branch,
          as: "branches",
        },
      ],
    });
    if (!agency) {
      throw createHttpError.NotFound("Agency not found");
    }
    return agency;
  }

  async create(agencyDto: AgencyDto): Promise<Agency> {
    const agency = await this.findOne({ name: agencyDto.name });
    if (agency) {
      throw new createHttpError.BadRequest("Agency name exist !!!");
    }
    await this.categoryService.getOne(agencyDto.categoryId);

    const newAgency = await this.agencyModel.create(toData(agencyDto));
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
}

export const agencyService = new AgencyServive();
