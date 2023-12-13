import Joi from "joi";
import { AgencyRoleType, RequestStatus, cities } from "../constants";

export const authSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().required(),
});

export const categorySchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim(),
});

export const agencySchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim(),
  categoryId: Joi.number().required(),
});

export const branchSchema = Joi.object({
  city: Joi.string()
    .trim()
    .valid(...cities),
  address: Joi.string().trim(),
  agencyId: Joi.number().required(),
});

export const requestSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim(),
  location: Joi.string().trim().required(),
  expectDate: Joi.date(),
  categoryId: Joi.number().required(),
  branchId: Joi.number().allow(null),
  userId: Joi.number(),
  city: Joi.string()
    .trim()
    .valid(...cities),
});

export const filterRequestsSchema = Joi.object({
  limit: Joi.number().optional(),
  page: Joi.number().optional(),
  category: Joi.number().optional(),
  status: Joi.string()
    .trim()
    .valid(...Object.values(RequestStatus))
    .optional(),
  city: Joi.string()
    .trim()
    .valid(...cities)
    .optional(),
});

export const filterAgenciesSchema = Joi.object({
  limit: Joi.number().optional(),
  page: Joi.number().optional(),
  categoryId: Joi.number().optional(),
  city: Joi.string()
    .trim()
    .valid(...cities)
    .optional(),
});

export const addStaffSchema = Joi.object({
  userId: Joi.number().required(),
  role: Joi.string()
    .trim()
    .valid(...Object.values(AgencyRoleType))
    .required(),
});
