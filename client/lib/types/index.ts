
type Primitive = string | number | boolean | null | undefined;
export interface IUser {
  [key: string]: Primitive;
  _id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role?: "ADMIN" | "TEACHER" | "STUDENT"
}

export type IMarks = {
  [key: string]: Primitive;
  _id?: string;
  studentId?: string;
  student: string | Record<string, any>; // studentId or populated object
  tamil: number;
  english: number;
  maths: number;
  physics: number;
  chemistry: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export interface BackendPayload {
  success?: unknown;
  message?: unknown;
  code?: unknown;
}

export interface ParsedBackendError {
  message: string;
  code: string | null;
}