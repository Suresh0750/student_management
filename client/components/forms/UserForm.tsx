// DynamicForm.tsx
import { useForm, FieldValues, DefaultValues, SubmitHandler, Resolver, Controller } from "react-hook-form";
import { joiResolver } from "@/lib/shared/joiResolver";
import Joi from "joi";
import { Input } from "../common/Input";
import { useEffect } from "react";

export type FieldConfig = {
  name: string;
  label: string;
  type?: string;
  info?: string;
  minLength?: number;
  disabled?: boolean;   // add this

  maxLength?: number;
  validation?: {
    required?: string;
  };
  // Select-specific
  options?: Record<string, any>[];
  labelKey?: string;   // which key to show in dropdown e.g. "name"
  valueKey?: string;   // optional: which key to use as <option> value (default: index)
};

type Props<T extends FieldValues> = {
  fields: FieldConfig[];
  schema?: Joi.ObjectSchema;
  defaultValues?: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  submitLabel?: string;
};

function DynamicForm<T extends FieldValues>({
  fields,
  schema,
  defaultValues,
  onSubmit,
  submitLabel = "Submit",
}: Props<T>) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<T>({
    defaultValues,
    resolver: schema ? (joiResolver(schema) as Resolver<T>) : undefined,
  });

  useEffect(() => {
    if (!defaultValues) return;
    const filteredValues = fields.reduce<Partial<Record<string, unknown>>>(
      (acc, field) => {
        acc[field.name] = defaultValues[field.name];
        return acc;
      },
      {}
    );
    reset(filteredValues as DefaultValues<T>);
  }, [defaultValues, fields, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {fields.map(({ name, label, type, info, minLength, maxLength, options, labelKey, disabled }) => {
        // ── Select field ──────────────────────────────────────────
        if (type === "select") {
          return (
            <Controller
              key={name}
              name={name as any}
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-zinc-700">{label}</label>
                  <select
                    className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    value={field.value ? JSON.stringify(field.value) : ""}
                    onChange={(e) => {
                      // Store the whole object as the field value
                      const selected = options?.find(
                        (opt) => JSON.stringify(opt) === e.target.value
                      );
                      field.onChange(selected ?? null);
                    }}
                  >
                    <option value="">Select {label}</option>
                    {options?.map((opt, i) => (
                      <option key={i} value={JSON.stringify(opt)}>
                        {labelKey ? opt[labelKey] : JSON.stringify(opt)}
                      </option>
                    ))}
                  </select>
                  {errors[name]?.message && (
                    <p className="text-xs text-red-500">{errors[name]?.message as string}</p>
                  )}
                </div>
              )}
            />
          );
        }

        // ── Regular input field ───────────────────────────────────
        return (
          <Input
            key={name}
            label={label}
            type={type}
            info={info}
            {...register(name as Parameters<typeof register>[0])}
            error={errors[name]?.message as string}
            minLength={minLength}
            maxLength={maxLength}
            disabled={disabled}
          />
        );
      })}

      <button className="w-full rounded-md bg-zinc-900 py-2 text-white cursor-pointer">
        {submitLabel}
      </button>
    </form>
  );
}

export default DynamicForm;