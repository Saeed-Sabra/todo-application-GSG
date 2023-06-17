import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export const validateResultMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createHttpError.UnprocessableEntity(errors);
  }
  next();
};
