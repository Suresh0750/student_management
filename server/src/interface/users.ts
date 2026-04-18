export type IRole = "ADMIN" | "TEACHER" | "STUDENT";


export interface IUsers {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: IRole;
    isDeleted: boolean;
  } 


export type TokenPayload = {
    userId: string;
    role: IRole;
    name: string;
    email: string;
  };