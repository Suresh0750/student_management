import { TokenPayload } from "../interface/users";
import { Request } from "express";
import dotenv from "dotenv"

dotenv.config()



export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';



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




export const SALT_ROUNDS = 10;