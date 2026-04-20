import { FieldConfig } from "@/components/forms/UserForm";

const BASE_FIELDS: FieldConfig[] = [
    { name: "name",  label: "Name",  validation: { required: "Required" } },
    { name: "email", label: "Email", validation: { required: "Required" } },
    { name: "phone", label: "Phone", minLength: 10, maxLength: 10 },
  ];
  
  export const ADD_FIELDS: FieldConfig[] = [
    ...BASE_FIELDS,
    { name: "password", label: "Password", type: "password", validation: { required: "Required" } },
  ];
  
  export const EDIT_FIELDS: FieldConfig[] = [
    ...BASE_FIELDS,
  ];