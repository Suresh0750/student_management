
type Primitive = string | number | boolean | null | undefined;
  export interface IUser {
    [key: string]: Primitive;
      _id: string;
      name: string;
      email: string;
      phone: string;
      password?: string;
      role ? : "ADMIN" | "TEACHER" | "STUDENT"
    }