export enum RoleType {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  AGENCY = "AGENCY",
}

export enum RatingPoint {
  VERY_BAD = 1,
  BAD = 2,
  NORMAL = 3,
  GOOD = 4,
  VERY_GOOD = 5,
}

export enum AgencyRoleType {
  STAFF = "STAFF",
  MANAGER = "MANAGER",
}

export enum RequestStatus {
  PENDING = "PENDING",
  PICKED = "PICKED",
  ACCEPT = "ACCEPT",
  DONE = "DONE",
  CANCEL = "CANCEL",
}

export enum StaffRequestStatus {
  PENDING = "PENDING",
  ACCEPT = "ACCEPT",
  REJECT = "REJECT",
}

export const cities = [
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cần Thơ",
  "Cao Bằng",
  "Đà Nẵng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Nội",
  "Hà Tĩnh",
  "Hải Dương",
  "Hải Phòng",
  "Hậu Giang",
  "Hồ Chí Minh",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

export enum HttpError {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 403,
}

export interface IAuth {
  accessToken: string;
}

export interface IUser {
  id?: number;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  fullName?: string;
  imageUrl?: string;
  active: boolean;
  role: RoleType;
  branchId: number | null;
  agencyRole: AgencyRoleType | null;
}

export interface ICategory {
  id?: number;
  name: string;
  description?: string;
}

export interface IAgency {
  id?: number;
  name: string;
  description?: string;
  categoryId: number;
  ownerId: number;
  logo: string;
}

export interface IAgencyCategory {
  agencyId: number;
  categoryId: number;
}

export interface IBranch {
  id?: number;
  city: string;
  address: string;
  agencyId: number;
}

export interface IRequest {
  id?: number;
  title: string;
  description: string;
  city: string;
  location: string;
  expectDate: string | string[];
  status: string;
  categoryId: number;
  branchId: number | null;
  customerPhone: string;
  customerName: string;
  customerEmail: string;
  userId: number;
}

export interface IStaffRequest {
  id?: number;
  branchId: number;
  userId: number;
  status: StaffRequestStatus;
  role: AgencyRoleType;
}

export interface IRating {
  id?: number;
  agencyId: number;
  userId: number;
  rating: RatingPoint;
}

export interface IComment {
  id?: number;
  agencyId: number;
  userId: number;
  comment: string;
}

export interface PaginationProps {
  total: number;
  entries: object[];
}

export interface PaginationOptions {
  sort: string;
  page: number;
  limit: number;
}
