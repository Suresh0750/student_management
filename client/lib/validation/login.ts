import Joi from "joi";

export type LoginFormValues = {
  email: string;
  password: string;
};

export const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "any.required": "Email is required",
      "string.email": "Enter a valid email address",
    }),
  password: Joi.string().required().min(8).messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
    "string.min": "Password must be at least {#limit} characters",
  }),
});

export function validateLogin(values: LoginFormValues):
  | { ok: true; value: LoginFormValues }
  | { ok: false; fieldErrors: Partial<Record<keyof LoginFormValues, string>> } {
  const { error, value } = loginSchema.validate(values, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    const fieldErrors: Partial<Record<keyof LoginFormValues, string>> = {};
    for (const detail of error.details) {
      const key = detail.path[0];
      if (key === "email" || key === "password") {
        if (!fieldErrors[key]) fieldErrors[key] = detail.message;
      }
    }
    return { ok: false, fieldErrors };
  }
  return { ok: true, value: value as LoginFormValues };
}
