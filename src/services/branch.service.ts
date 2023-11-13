import { Branch } from "../models";
import { toData } from "../common/mappers";
import { BranchDto } from "../dtos/branch/branch.dto";
import createHttpError from "http-errors";
import { agencyService } from "./agency.service";

interface IBranchService {
  getOne(id: number): Promise<Branch>;
  create(branchDto: BranchDto): Promise<Branch>;
  update(id: number, branchDto: BranchDto): Promise<Branch>;
}

class BranchServive implements IBranchService {
  private branchModel = Branch;
  private agencyService = agencyService;

  async getOne(id: number): Promise<Branch> {
    const branch = await this.branchModel.findOne({
      where: { id },
    });
    if (!branch) {
      throw createHttpError.NotFound("Branch not found");
    }
    return branch;
  }

  async create(branchDto: BranchDto): Promise<Branch> {
    await this.agencyService.getOne(branchDto.agencyId);
    const newBranch = await this.branchModel.create(toData(branchDto));
    return await this.getOne(newBranch.id);
  }

  async update(id: number, branchDto: BranchDto): Promise<Branch> {
    await this.agencyService.getOne(branchDto.agencyId);
    const [count] = await this.branchModel.update(toData(branchDto), {
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

export const branchService = new BranchServive();
