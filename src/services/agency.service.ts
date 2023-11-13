import { Agency, AgencyCategory, Branch, Category } from "../models";
import { toData } from "../common/mappers";
import createHttpError from "http-errors";
import { AgencyDto } from "../dtos/agency/agency.dto";
import { categoryService } from "./category.service";

interface IAgencyService {
  getAll(): Promise<Agency[]>;
  getOne(id: number): Promise<Agency>;
  create(agencyDto: AgencyDto): Promise<Agency>;
  update(id: number, agencyDto: AgencyDto): Promise<Agency>;
  addCategoriesForAgency(categories: number[], agencyId: number): Promise<void>;
  removeCategoriesForAgency(
    categories: number[],
    agencyId: number
  ): Promise<void>;
}

class AgencyServive implements IAgencyService {
  private agencyModel = Agency;
  private agencyCategoryModel = AgencyCategory;
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

  async getOne(id: number): Promise<Agency> {
    const agency = await this.agencyModel.findOne({
      where: { id },
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
    if (!agency) {
      throw createHttpError.NotFound("Agency not found");
    }
    return agency;
  }

  async create(agencyDto: AgencyDto): Promise<Agency> {
    const isAllExist = await this.categoryService.isAllExist(
      agencyDto.categories
    );
    if (!isAllExist) {
      throw new createHttpError.BadRequest(
        "One of list categories not exist !!!"
      );
    }
    const newAgency = await this.agencyModel.create(toData(agencyDto));

    if (agencyDto.categories && agencyDto.categories.length > 0) {
      await this.addCategoriesForAgency(agencyDto.categories, newAgency.id);
    }
    return await this.getOne(newAgency.id);
  }

  async update(id: number, agencyDto: AgencyDto): Promise<Agency> {
    const isAllExist = await this.categoryService.isAllExist(
      agencyDto.categories
    );
    if (!isAllExist) {
      throw new createHttpError.BadRequest(
        "One of list categories not exist !!!"
      );
    }
    const oldCategories = await this.agencyCategoryModel.findAll({
      where: {
        agencyId: id,
      },
      attributes: ["categoryId"],
      raw: true,
    });
    const oldCategoriesMapped = oldCategories.map((item) => item.categoryId);
    if (agencyDto.categories && agencyDto.categories.length > 0) {
      for (const category of agencyDto.categories) {
        if (oldCategories.some((e) => e.categoryId === category)) {
          agencyDto.categories.splice(
            agencyDto.categories.indexOf(category),
            1
          );
          oldCategoriesMapped.splice(oldCategoriesMapped.indexOf(category), 1);
        }
      }
      await this.addCategoriesForAgency(agencyDto.categories, id);
      await this.removeCategoriesForAgency(oldCategoriesMapped, id);
    }
    const [count] = await this.agencyModel.update(toData(agencyDto), {
      where: {
        id,
      },
    });
    if (count === 0) {
      throw createHttpError.NotFound("Not found");
    }
    const agency = await this.getOne(id);
    return agency;
  }

  async addCategoriesForAgency(categories: number[], agencyId: number) {
    for (const category of categories) {
      await this.agencyCategoryModel.create({
        agencyId: agencyId,
        categoryId: category,
      });
    }
  }

  async removeCategoriesForAgency(categories: number[], agencyId: number) {
    for (const category of categories) {
      await this.agencyCategoryModel.destroy({
        where: {
          agencyId: agencyId,
          categoryId: category,
        },
      });
    }
  }
}

export const agencyService = new AgencyServive();
