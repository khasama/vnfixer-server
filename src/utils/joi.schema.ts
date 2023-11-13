import Joi from "joi";
import { cities } from "../constants";

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
  categories: Joi.array().items(Joi.number()),
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
});
