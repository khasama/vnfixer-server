import { User } from "./users.model";
import { Agency } from "./agencies.model";
import { Branch } from "./branches.model";
import { Category } from "./categories.model";
import { Request } from "./requests.model";
import { StaffRequest } from "./staff-request.model";
import { Rating } from "./rating.model";
import { Comment } from "./comment.model";
import { Notification } from "./notifications.model";
import { Payment } from "./payment.model";

User.belongsTo(Branch, {
  foreignKey: "branchId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "branch",
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
  as: "agency",
});
Agency.hasMany(Branch, {
  foreignKey: "agencyId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "branches",
});

Agency.belongsTo(User, {
  foreignKey: "ownerId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "owner",
});
User.hasOne(Agency, {
  foreignKey: "ownerId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "agency",
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
  as: "requests",
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

Request.belongsTo(User, {
  foreignKey: "staffId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "staff",
});
User.hasMany(Request, {
  foreignKey: "staffId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "requestsTaked",
});

Request.belongsTo(User, {
  foreignKey: "pickerId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "picker",
});
User.hasMany(Request, {
  foreignKey: "pickerId",
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
  as: "branch",
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

Comment.belongsTo(Agency, {
  foreignKey: "agencyId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
Agency.hasMany(Comment, {
  foreignKey: "agencyId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "comments",
});

Comment.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "owner",
});
User.hasMany(Comment, {
  foreignKey: "userId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "comments",
});

Notification.belongsTo(User, {
  foreignKey: "ownerId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  as: "owner",
});
User.hasMany(Notification, {
  foreignKey: "ownerId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

export {
  User,
  Agency,
  Branch,
  Category,
  Request,
  StaffRequest,
  Rating,
  Comment,
  Notification,
  Payment,
};
