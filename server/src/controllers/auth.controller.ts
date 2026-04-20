

import { Request, Response } from 'express';
import User from '../models/user.schema';
import { generateToken } from '../utils/jwt';
import { ADMIN_EMAIL, ADMIN_PASSWORD, adminCredentials } from '../utils/common';
import { HttpStatusCode } from '../interface/utils';
import { AppError } from '../utils/AppError';
import { comparePassword } from '../utils/service';


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1. Check input
  if (!email || !password) {
    throw new AppError("Email and password are required", HttpStatusCode.BAD_REQUEST);
  }

  // 2. Find user from DB
  const user = await User.findOne({ email, isDeleted: false });

  if (!user) {
    throw new AppError("User not found", HttpStatusCode.UNAUTHORIZED);
  }

  // 3. Compare password
  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid password", HttpStatusCode.UNAUTHORIZED);
  }

  // 4. Generate token using REAL user data
  const token = generateToken({
    _id: user._id.toString(),
    role: user.role,
    name: user.name,
    email: user.email,
  });

  // 5. Send response
  return res.status(HttpStatusCode.SUCCESS).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
    message: "Login successful",
  });
};

