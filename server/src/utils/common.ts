import { TokenPayload } from "../interface/users";
import { Request } from "express";



export const ADMIN_EMAIL = 'admin@gmail.com';
export const ADMIN_PASSWORD = 'admin123';



export const adminCredentials : TokenPayload = {
    userId : "1234566",
    role : "ADMIN",
    name : "suresh",
    email : ADMIN_EMAIL,
}


export interface AuthRequest extends Request {
  userId?: string;
  role?: string;
}


export enum IAccessRole {
    ADMIN = "ADMIN",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT",
  }


export const JWT_SECRET = process.env.JWT_SECRET || "secret";