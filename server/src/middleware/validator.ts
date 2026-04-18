import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { HttpStatusCode } from "../interface/utils";
import { AppError } from "../utils/AppError";

type ValidateType = "body" | "query" | "params";

 const validate = (schema: ObjectSchema, type: ValidateType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[type]; // dynamic access

    const { error, value } = schema.validate(data, {
      abortEarly: false, // show all errors
      stripUnknown: true // remove unwanted fields
    });

    if (error) {
      return next(
        new AppError(
          "Validation error",
          HttpStatusCode.BAD_REQUEST,
          error.details.map((err) => err.message)
        )
      );
    }

    // ✅ overwrite sanitized data
    req[type] = value;

    next();
  };
};

export default validate;