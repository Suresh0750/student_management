import Joi from "joi";

export const marksSchema = Joi.object({
  tamil: Joi.number().min(0).max(100).required(),
  english: Joi.number().min(0).max(100).required(),
  maths: Joi.number().min(0).max(100).required(),
  physics: Joi.number().min(0).max(100).required(),
  chemistry: Joi.number().min(0).max(100).required(),
});

export const passwordSchema = Joi.string().trim().min(6).required().messages({
  "string.empty": "Password is required",
  "string.min": "Minimum 6 characters",
});

const baseUserFields = {
  name: Joi.string().trim().min(3).required().messages({
    "string.empty": "Name is required",
    "string.min": "Minimum 3 characters",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.email": "Invalid email",
    "string.empty": "Email is required",
  }),
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