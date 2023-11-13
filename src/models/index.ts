import { User } from "./users.model";
import { Agency } from "./agencies.model";
import { Branch } from "./branches.model";
import { Category } from "./categories.model";
import { Request } from "./requests.model";
import { AgencyCategory } from "./agency-category.model";

User.belongsTo(Branch, {
  foreignKey: "branchId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
Branch.hasMany(User, {
  foreignKey: "branchId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

Branch.belongsTo(Agency, {
  foreignKey: "agencyId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "branches",
});
Agency.hasMany(Branch, {
  foreignKey: "agencyId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "branches",
});

Request.belongsTo(Branch, {
  foreignKey: "branchId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "branch",
});
Branch.hasMany(Request, {
  foreignKey: "branchId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

Request.belongsTo(Category, {
  foreignKey: "categoryId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "category",
});
Category.hasMany(Request, {
  foreignKey: "categoryId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

Request.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
User.hasMany(Request, {
  foreignKey: "userId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

Agency.belongsToMany(Category, {
  through: AgencyCategory,
  as: "categories",
  foreignKey: "agencyId",
});
Category.belongsToMany(Agency, {
  through: AgencyCategory,
  as: "agencies",
  foreignKey: "categoryId",
});

Agency.hasMany(AgencyCategory, { foreignKey: "agencyId" });
AgencyCategory.belongsTo(Agency, {
  foreignKey: "agencyId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
Category.hasMany(AgencyCategory, { foreignKey: "categoryId" });
AgencyCategory.belongsTo(Category, {
  foreignKey: "categoryId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

export { User, Agency, Branch, Category, Request, AgencyCategory };
