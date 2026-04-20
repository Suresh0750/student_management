import Joi from "joi";

export const marksSchema = Joi.object({
  tamil: Joi.number().min(0).max(100).required(),
  english: Joi.number().min(0).max(100).required(),
  maths: Joi.number().min(0).max(100).required(),
  physics: Joi.number().min(0).max(100).required(),
  chemistry: Joi.number().min(0).max(100).required(),
});

export const passwordSchema = Joi.string().trim().min(6).pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$")).required().messages({
  "string.empty": "Password is required",
  "string.min": "Minimum 6 characters",
  "string.pattern.base": "Password must be at least 6 characters, including at least 1 letter and 1 number.",
});

export const emailSchema = Joi.string()
  .trim()
  .lowercase()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    "string.empty": "Email is required",
    "any.required": "Email is required",
    "string.email": "Enter a valid email address",
  })

const baseUserFields = {
  name: Joi.string().trim().min(3).required().messages({
    "string.empty": "Name is required",
    "string.min": "Minimum 3 characters",
  }),
  email: emailSchema,
  phone: Joi.string().trim().min(10).max(10).required().messages({
    "string.empty": "Phone is required",
  }),
};

export const userSchema = Joi.object(baseUserFields);

export const addUserSchema = Joi.object({
  ...baseUserFields,
  password: passwordSchema,
});

export const editUserSchema = Joi.object({
  ...baseUserFields,
});

const marksFields = {
  tamil: Joi.number().min(0).max(100).required().messages({
    "number.base": "Tamil mark is required",
    "number.min": "Min value is 0",
    "number.max": "Max value is 100",
  }),
  english: Joi.number().min(0).max(100).required().messages({
    "number.base": "English mark is required",
    "number.min": "Min value is 0",
    "number.max": "Max value is 100",
  }),
  maths: Joi.number().min(0).max(100).required().messages({
    "number.base": "Maths mark is required",
    "number.min": "Min value is 0",
    "number.max": "Max value is 100",
  }),
  physics: Joi.number().min(0).max(100).required().messages({
    "number.base": "Physics mark is required",
    "number.min": "Min value is 0",
    "number.max": "Max value is 100",
  }),
  chemistry: Joi.number().min(0).max(100).required().messages({
    "number.base": "Chemistry mark is required",
    "number.min": "Min value is 0",
    "number.max": "Max value is 100",
  }),
};


// schemas.ts
export const addStudentSchema = Joi.object({
  user: Joi.object().required().messages({
    "object.base": "Please select a student",
    "any.required": "Please select a student",
  }),
  ...marksFields,
});

export const editStudentSchema = Joi.object({
  user: Joi.any().optional(),
  ...marksFields,
});