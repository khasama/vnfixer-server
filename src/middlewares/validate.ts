import { NextFunction, Request, Response } from "express";
import {
  addStaffSchema,
  agencySchema,
  authSchema,
  branchSchema,
  categorySchema,
  filterAgenciesSchema,
  filterRequestsSchema,
  findWithEmailSchema,
  requestSchema,
  updateInfoSchema,
  updateNotiTokenSchema,
} from "../utils/joi.schema";
import Joi from "joi";

function validate(schema: Joi.ObjectSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }
    next();
  };
}

function validateQuery(schema: Joi.ObjectSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query);
    if (error) {
      next(error);
    }
    next();
  };
}

export const authValidate = validate(authSchema);
export const categoryValidate = validate(categorySchema);
export const agencyValidate = validate(agencySchema);
export const branchValidate = validate(branchSchema);
export const requestValidate = validate(requestSchema);
export const addStaffValidate = validate(addStaffSchema);
export const updateInfoValidate = validate(updateInfoSchema);
export const updateNotiTokenValidate = validate(updateNotiTokenSchema);
export const filterRequestsValidate = validateQuery(filterRequestsSchema);
export const filterAgenciesValidate = validateQuery(filterAgenciesSchema);
export const findWithEmailSchemaValidate = validateQuery(findWithEmailSchema);
