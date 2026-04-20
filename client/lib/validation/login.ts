import Joi from "joi";
import { emailSchema, passwordSchema } from "./users.schema";

export type LoginFormValues = {
  email: string;
  password: string;
};

export const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema
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
