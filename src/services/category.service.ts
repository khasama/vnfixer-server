import { Agency, Category } from "../models";
import { toData } from "../common/mappers";
import { CategoryDto } from "../dtos/category/category.dto";
import createHttpError from "http-errors";

interface ICategoryService {
  getAll(): Promise<Category[]>;
  getOne(id: number): Promise<Category>;
  create(categoryDto: CategoryDto): Promise<Category>;
  update(id: number, categoryDto: CategoryDto): Promise<Category>;
  isAllExist(categoryIds: number[]): Promise<boolean>;
}

class CategoryServive implements ICategoryService {
  private categoryModel = Category;

  async getAll(): Promise<Category[]> {
    const categories = await this.categoryModel.findAll({
      include: [
        {
          model: Agency,
          as: "agencies",
          attributes: ["id", "name", "description"],
        },
      ],
    });
    return categories;
  }

  async getOne(id: number): Promise<Category> {
    const category = await this.categoryModel.findOne({
      where: { id },
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

  async create(categoryDto: CategoryDto): Promise<Category> {
    const category = await this.categoryModel.create(toData(categoryDto));
    return await this.getOne(category.id);
  }

  async update(id: number, categoryDto: CategoryDto): Promise<Category> {
    const [count] = await this.categoryModel.update(toData(categoryDto), {
      where: {
        id,
      },
    });
    if (count === 0) {
      throw createHttpError.NotFound("Not found");
    }
    const category = await this.categoryModel.findOne({ where: { id } });
    return category;
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
