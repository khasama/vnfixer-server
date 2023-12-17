import { Agency, Category, Request } from "../models";
import { toData } from "../common/mappers";
import { CategoryDto } from "../dtos/category/category.dto";
import createHttpError from "http-errors";
import { PaginationOptions, PaginationProps } from "../constants";
import { Op } from "sequelize";

interface ICategoryService {
  getAll(): Promise<Category[]>;
  getAllWithPagination(option: PaginationOptions): Promise<PaginationProps>;
  findOne(filter): Promise<Category>;
  getOne(filter): Promise<Category>;
  create(categoryDto: CategoryDto): Promise<Category>;
  update(id: number, categoryDto: CategoryDto): Promise<Category>;
  isAllExist(categoryIds: number[]): Promise<boolean>;
}

class CategoryServive implements ICategoryService {
  private categoryModel = Category;

  async getAll(): Promise<Category[]> {
    const categories = await this.categoryModel.findAll({
      attributes: ["id", "name", "description"],
      include: [
        {
          model: Agency,
          as: "agencies",
          attributes: ["id", "name", "description"],
        },
        {
          model: Request,
          as: "requests",
          attributes: ["id", "status"],
        },
      ],
    });
    return categories;
  }

  async getAllWithPagination(
    option: PaginationOptions
  ): Promise<PaginationProps> {
    const skip = (option.page - 1) * option.limit;
    const { count } = await this.categoryModel.findAndCountAll();
    const categories = await this.categoryModel.findAll({
      limit: option.limit,
      offset: skip,
      include: [
        {
          model: Agency,
          as: "agencies",
          attributes: ["id", "name", "description"],
        },
      ],
    });
    return { entries: categories, total: count };
  }

  async findOne(filter): Promise<Category> {
    const category = await this.categoryModel.findOne({
      where: filter,
      include: [
        {
          model: Agency,
          as: "agencies",
          attributes: ["id", "name", "description"],
        },
      ],
    });
    return category;
  }

  async getOne(filter): Promise<Category> {
    const category = await this.findOne(filter);
    if (!category) {
      throw createHttpError.NotFound("Category not found");
    }
    return category;
  }

  async create(categoryDto: CategoryDto): Promise<Category> {
    const category = await this.findOne({ name: categoryDto.name });
    if (category) {
      throw createHttpError.BadRequest("Category is exist");
    }
    const newCategory = await this.categoryModel.create(toData(categoryDto));
    return await this.getOne(newCategory.id);
  }

  async update(id: number, categoryDto: CategoryDto): Promise<Category> {
    const category = await this.findOne({
      name: categoryDto.name,
      id: { [Op.ne]: id },
    });
    if (category) {
      throw new createHttpError.BadRequest("Category name exist !!!");
    }
    const [count] = await this.categoryModel.update(toData(categoryDto), {
      where: {
        id,
      },
    });
    if (count === 0) {
      throw createHttpError.NotFound("Not found");
    }
    const categoryUpdated = await this.categoryModel.findOne({ where: { id } });
    return categoryUpdated;
  }

  async isAllExist(categoryIds: number[]): Promise<boolean> {
    const { count } = await this.categoryModel.findAndCountAll({
      where: {
        id: categoryIds,
      },
    });
    return count === categoryIds.length;
  }
}

export const categoryService = new CategoryServive();
