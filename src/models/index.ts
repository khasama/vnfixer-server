import { User } from "./users.model";
import { Agency } from "./agencies.model";
import { Branch } from "./branches.model";
import { Category } from "./categories.model";
import { Request } from "./requests.model";
import { StaffRequest } from "./staff-request.model";
import { Rating } from "./rating.model";

User.belongsTo(Branch, {
  foreignKey: "branchId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
Branch.hasMany(User, {
  foreignKey: "branchId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "users",
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
  as: "requests",
});

Agency.belongsTo(Category, {
  foreignKey: "categoryId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "category",
});
Category.hasMany(Agency, {
  foreignKey: "categoryId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "agencies",
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

StaffRequest.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
User.hasMany(StaffRequest, {
  foreignKey: "userId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
StaffRequest.belongsTo(Branch, {
  foreignKey: "branchId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
Branch.hasMany(StaffRequest, {
  foreignKey: "branchId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

Rating.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
User.hasMany(Rating, {
  foreignKey: "userId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

Rating.belongsTo(Agency, {
  foreignKey: "agencyId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
Agency.hasMany(Rating, {
  foreignKey: "agencyId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "ratings",
});

export { User, Agency, Branch, Category, Request, StaffRequest, Rating };
