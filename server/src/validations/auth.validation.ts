import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
      "any.required": "Email is required"
    }),

    password: Joi.string()
    .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$"))
    .required()
    .messages({
      "string.pattern.base": "Password must contain letters and numbers",
      "string.empty": "Password is required"
    })
});