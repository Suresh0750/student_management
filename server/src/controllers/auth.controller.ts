

import { Request, Response } from 'express';
import User from '../models/user.schema';
import { generateToken } from '../utils/jwt';
import { ADMIN_EMAIL, ADMIN_PASSWORD, adminCredentials } from '../utils/common';
import { HttpStatusCode } from '../interface/utils';
import { AppError } from '../utils/AppError';


export const login = async (req: Request, res: Response) => {
  const { email = null, password = null } = req.body;
  // const user = await User.findOne({ email });

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    throw new AppError("User not found", HttpStatusCode.UNAUTHORIZED);
  }

  // if(user.password !== password){
  //   throw { status: HttpStatusCode.UNAUTHORIZED, message: "Invalid password" };
  // }

  // const token = generateToken(user._id.toString(), user.role, user.name, user.email);

  const token = generateToken(adminCredentials);

  return res.status(HttpStatusCode.SUCCESS).json({
    success: true,
    user: adminCredentials,
    token,
    message: "Login successful",
  });
}


