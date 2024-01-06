import { AgencyRoleType, CategoryKey, RoleType, cities } from "../constants";
import { Agency, Branch, Category, User } from "../models";
import bcrypt from "bcrypt";

class SeedServive {
  private userModel = User;
  private categoryModel = Category;
  private agencyModel = Agency;
  private branchModel = Branch;

  async seed() {
    const users = await this.userModel.bulkCreate([
      {
        email: "khavl741953@gmail.com",
        password: await bcrypt.hash("0905082320", 10),
      },
      {
        email: "huynhtinnhan2020@gmail.com",
        password: await bcrypt.hash("123456a@", 10),
      },
      {
        email: "test1@gmail.com",
        password: await bcrypt.hash("123456a@", 10),
      },
      {
        email: "test2@gmail.com",
        password: await bcrypt.hash("123456a@", 10),
      },
      {
        email: "test3@gmail.com",
        password: await bcrypt.hash("123456a@", 10),
      },
      {
        email: "test4@gmail.com",
        password: await bcrypt.hash("123456a@", 10),
      },
      {
        email: "test5@gmail.com",
        password: await bcrypt.hash("123456a@", 10),
      },
      {
        email: "test6@gmail.com",
        password: await bcrypt.hash("123456a@", 10),
      },
      {
        email: "test7@gmail.com",
        password: await bcrypt.hash("123456a@", 10),
      },
      {
        email: "test8@gmail.com",
        password: await bcrypt.hash("123456a@", 10),
      },
      {
        email: "test9@gmail.com",
        password: await bcrypt.hash("123456a@", 10),
      },
      {
        email: "test10@gmail.com",
        password: await bcrypt.hash("123456a@", 10),
      },
      {
        email: "test11@gmail.com",
        password: await bcrypt.hash("123456a@", 10),
      },
      {
        email: "test12@gmail.com",
        password: await bcrypt.hash("123456a@", 10),
      },
      {
        email: "test13@gmail.com",
        password: await bcrypt.hash("123456a@", 10),
      },
      {
        email: "test14@gmail.com",
        password: await bcrypt.hash("123456a@", 10),
      },
    ]);

    const categories = await this.categoryModel.bulkCreate([
      {
        name: "Sửa chữa xe máy",
        key: CategoryKey.XE_MAY,
        description: "",
      },
      {
        name: "Sửa chữa thiết bị văn phòng",
        key: CategoryKey.VAN_PHONG,
        description: "(Máy in, máy fax, máy photo, scan, ...)",
      },
      {
        name: "Sửa chữa đồ gia dụng",
        key: CategoryKey.DO_GIA_DUNG,
        description: "(Quạt, nồi cơm, biếp gas, lò vi sóng, ...)",
      },
      {
        name: "Sửa chữa điện lạnh",
        key: CategoryKey.DIEN_LANH,
        description: "(Tủ lạnh, điều hoà, máy giặt, ...)",
      },
      {
        name: "Sửa chữa nội thất",
        key: CategoryKey.NOI_THAT,
        description: "(Bàn, ghế, tủ, kệ, ...)",
      },
      {
        name: "Sửa chữa điện nước",
        key: CategoryKey.DIEN_NUOC,
        description: "(đường ống nước, đường dây điện)",
      },
      {
        name: "Sửa chữa hệ thống an ninh",
        key: CategoryKey.AN_NINH,
        description: "(Camera, thiết bị chống trộm, máy quét vân tay, ...)",
      },
    ]);

    for (const user of users) {
      const agency = await this.agencyModel.create({
        name: `Agency ${user.email}`,
        description: `This is description of agency ${user.id}`,
        ownerId: user.id,
        categoryId:
          categories[Math.floor(Math.random() * categories.length)].id,
      });
      const branches = await this.branchModel.bulkCreate([
        {
          city: cities[Math.floor(Math.random() * cities.length)],
          address: `address 1 of ${agency.name}`,
          agencyId: agency.id,
        },
        {
          city: cities[Math.floor(Math.random() * cities.length)],
          address: `address 2 of ${agency.name}`,
          agencyId: agency.id,
        },
        {
          city: cities[Math.floor(Math.random() * cities.length)],
          address: `address 3 of ${agency.name}`,
          agencyId: agency.id,
        },
      ]);
      await this.userModel.update(
        {
          branchId: branches[0].id,
          agencyRole: AgencyRoleType.MANAGER,
          role: RoleType.AGENCY,
        },
        {
          where: { id: user.id },
        }
      );
    }

    return { message: "seeder run success" };
  }
}

export const seedService = new SeedServive();
