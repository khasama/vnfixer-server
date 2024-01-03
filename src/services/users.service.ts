import createHttpError from "http-errors";
import { Agency, Branch, StaffRequest, User } from "../models";
import { AgencyRoleType, StaffRequestStatus } from "../constants";
import { Op } from "sequelize";
import { UserDto } from "../dtos/user/user.dto";
import { toData } from "../common/mappers";
import { encryptData } from "../utils/hashToken";

interface IUserService {
  getAll(): Promise<User[]>;
}

class UserServive implements IUserService {
  private userModel = User;
  private staffRequestModel = StaffRequest;

  async getAll(): Promise<User[]> {
    const users = await this.userModel.findAll();
    return users;
  }

  async findOne(filter): Promise<User> {
    const user = await this.userModel.findOne({
      where: filter,
    });
    return user;
  }

  async getOne(filter): Promise<User> {
    const user = await this.findOne(filter);
    if (!user) {
      throw createHttpError.NotFound("User not found");
    }
    return user;
  }

  async allStaffRequest(id: number): Promise<StaffRequest[]> {
    const requests = await this.staffRequestModel.findAll({
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
      ],
    });
    return requests;
  }

  async updateAgencyStaff(
    branchId: number,
    role: AgencyRoleType,
    userId: number
  ) {
    await this.userModel.update(
      {
        branchId,
        agencyRole: role,
      },
      {
        where: { id: userId },
      }
    );
  }

  async staffRequest(
    userId: number,
    requestId: number,
    action: StaffRequestStatus
  ) {
    if (!Object.values(StaffRequestStatus).includes(action)) {
      throw createHttpError.BadRequest("Action invalid");
    }
    const request = await this.staffRequestModel.findOne({
      where: {
        id: requestId,
        userId,
        status: { [Op.or]: [StaffRequestStatus.PENDING] },
      },
    });
    if (!request) {
      throw createHttpError.BadRequest("Request expired");
    }
    if (action === StaffRequestStatus.ACCEPT) {
      await this.updateAgencyStaff(request.branchId, request.role, userId);
    }
    await this.staffRequestModel.update(
      { status: action },
      {
        where: { id: requestId },
      }
    );
  }

  async updateInfo(userId: number, userDto: UserDto) {
    await this.userModel.update(toData(userDto), {
      where: {
        id: userId,
      },
    });
    const userUpdated = await this.userModel.findOne({
      where: {
        id: userId,
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
      ],
    });
    return userUpdated;
  }

  async updateNotiToken(userId: number, token: string) {
    await this.userModel.update(
      {
        mobileNotiToken: encryptData(token),
      },
      {
        where: {
          id: userId,
        },
      }
    );
  }

  async findWithEmail(email: string): Promise<User[]> {
    const users = await this.userModel.findAll({
      where: {
        email: {
          [Op.like]: `%${email}%`,
        },
      },
      attributes: ["id", "email", "branchId", "imageUrl"],
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
      ],
    });
    return users;
  }
}

export const userService = new UserServive();
