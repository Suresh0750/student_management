import jwt from "jsonwebtoken";
import { IUsers, TokenPayload } from "../interface/users";


export const generateToken = ({ _id, role, name, email }: TokenPayload) => {
  return jwt.sign(
    { _id, role, name, email },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
};