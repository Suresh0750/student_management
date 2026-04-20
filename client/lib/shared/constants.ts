import { FieldConfig } from "@/components/forms/UserForm";


export const MARK_KEYS = ["tamil", "english", "maths", "physics", "chemistry"] as const;

const BASE_FIELDS: FieldConfig[] = [
  { name: "name", label: "Name", validation: { required: "Required" } },
  { name: "email", label: "Email", validation: { required: "Required" } },
  { name: "phone", label: "Phone", minLength: 10, maxLength: 10 },
];

export const ADD_FIELDS: FieldConfig[] = [
  ...BASE_FIELDS,
  { name: "password", label: "Password", type: "password", info: "Must be at least 6 characters, including 1 letter and 1 number.", validation: { required: "Required" } },
];

export const EDIT_FIELDS: FieldConfig[] = [
  ...BASE_FIELDS,
];


export const studentColumns = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "password", header: "Password" },
  { key: "tamil", header: "Tamil" },
  { key: "english", header: "English" },
  { key: "maths", header: "Maths" },
  { key: "physics", header: "Physics" },
  { key: "chemistry", header: "Chemistry" },
] as const;

export const MARK_FIELDS: FieldConfig[] = [
  { name: "tamil", label: "Tamil", type: "number" },
  { name: "english", label: "English", type: "number" },
  { name: "maths", label: "Maths", type: "number" },
  { name: "physics", label: "Physics", type: "number" },
  { name: "chemistry", label: "Chemistry", type: "number" },
];


export const STORAGE_KEY = "student_portal.user";
