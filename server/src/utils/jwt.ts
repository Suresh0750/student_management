import jwt from "jsonwebtoken";
import { IUsers, TokenPayload } from "../interface/users";


export const generateToken = ({ userId, role, name, email }: TokenPayload) => {
  return jwt.sign(
    { userId: userId, role, name, email },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );
};