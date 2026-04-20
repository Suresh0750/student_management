import { useForm, FieldValues, DefaultValues, SubmitHandler ,Resolver} from "react-hook-form";
import { joiResolver } from "@/lib/shared/joiResolver";
import Joi, { Schema } from "joi";
import { Input } from "../common/Input";
import { useEffect } from "react";

export type FieldConfig = {
  name: string;
  label: string;
  type?: string;
  info?: string;
  minLength?: number;
  maxLength?: number;
  validation?: {
    required?: string;
  };
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
  const submitHandler = (data:any)=>{
    alert("submit data")
    onSubmit?.(data)
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-3">
      {fields.map(({ name, label, type, info, minLength, maxLength }) => (
        <Input
          key={name}
          label={label}
          type={type}
          info={info}
          {...register(name as Parameters<typeof register>[0])}
          error={errors[name]?.message as string}
          minLength={minLength}
          maxLength={maxLength}
        />
      ))}
      <button className="w-full rounded-md bg-zinc-900 py-2 text-white cursor-pointer">
        {submitLabel}
      </button>
    </form>
  );
}

export default DynamicForm;