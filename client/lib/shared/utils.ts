import { FieldConfig } from "@/components/forms/UserForm";
import { MARK_FIELDS, MARK_KEYS, studentColumns } from "./constants";



export const API_URL = '/v1'


const getFieldType = (key: string): string => {
    if (key === "password") return "password";
    if (MARK_KEYS.includes(key as any)) return "number";
    return "text";
};



export const ADD_STUDENT_FIELDS: FieldConfig[] = studentColumns.map(
    ({ key, header }) => ({
        name: key,
        label: header,
        type: getFieldType(key),
        ...(MARK_KEYS.includes(key as any) && { min: 0, max: 100 }),
    })
);

// Edit: exclude password column
export const EDIT_STUDENT_FIELDS: FieldConfig[] = studentColumns
    .filter(({ key }) => key !== "password")
    .map(({ key, header }) => ({
        name: key,
        label: header,
        type: getFieldType(key),
        ...(MARK_KEYS.includes(key as any) && { min: 0, max: 100 }),
    }));


export const getStudentFields = (
    users: Record<string, any>[],
    labelKey = "name",
    isEdit = false
): FieldConfig[] => [
        {
            name: "user",
            label: "Name",
            type: isEdit ? "text" : "select",   // text input when editing
            ...(isEdit
                ? { disabled: true }            // non-editable
                : { options: users, labelKey }  // dropdown when adding
            ),
        },
        ...MARK_FIELDS,
    ];