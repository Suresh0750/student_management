import { Resolver } from "react-hook-form";

export const joiResolver =
  (schema: any): Resolver =>
  async (values) => {
    const { error, value } = schema.validate(values, {
      abortEarly: false, // show all errors
    });

    if (!error) {
      return {
        values: value,
        errors: {},
      };
    }

    const errors = error.details.reduce((acc: any, curr: any) => {
      acc[curr.path[0]] = {
        type: "manual",
        message: curr.message,
      };
      return acc;
    }, {});

    return {
      values: {},
      errors,
    };
  };