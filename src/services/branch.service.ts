import { Branch, StaffRequest } from "../models";
import { toData } from "../common/mappers";
import { BranchDto } from "../dtos/branch/branch.dto";
import createHttpError from "http-errors";
import { agencyService } from "./agency.service";
import { userService } from "./users.service";
import { AgencyRoleType, StaffRequestStatus } from "../constants";

interface IBranchService {
  getOne(filter): Promise<Branch>;
  findOne(filter): Promise<Branch>;
  create(branchDto: BranchDto): Promise<Branch>;
  update(id: number, branchDto: BranchDto): Promise<Branch>;
}

class BranchServive implements IBranchService {
  private branchModel = Branch;
  private staffRequestModel = StaffRequest;
  private agencyService = agencyService;
  private userService = userService;

  async findOne(filter): Promise<Branch> {
    const branch = await this.branchModel.findOne({
      where: filter,
    });
    return branch;
  }

  async getOne(filter): Promise<Branch> {
    const branch = await this.findOne(filter);
    if (!branch) {
      throw createHttpError.NotFound("Branch not found");
    }
    return branch;
  }

  async create(branchDto: BranchDto): Promise<Branch> {
    await this.agencyService.getOne(branchDto.agencyId);
    const newBranch = await this.branchModel.create(toData(branchDto));
    return await this.getOne({ id: newBranch.id });
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
    return await this.getOne({ id });
  }

  async addStaff(branchId: number, userId: number, role: AgencyRoleType) {
    if (!branchId || !userId || !role) {
      throw createHttpError.BadRequest("Missing param(s)");
    }
    await this.getOne({ id: branchId });
    const user = await this.userService.getOne({ id: userId });
    if (user.branchId) {
      throw createHttpError.BadRequest("This user already has branch");
    }
    const request = await this.staffRequestModel.findOne({
      where: {
        branchId,
        userId,
        status: StaffRequestStatus.PENDING,
      },
    });
    if (request) {
      throw createHttpError.BadRequest("Request already exist");
    }
    await this.staffRequestModel.create({
      branchId,
      userId,
      role,
    });
  }

  async removeStaff(branchId: number, userId: number) {}
}

export const branchService = new BranchServive();
