import { Request, Response } from 'express';
import User from '../models/user.schema';
import { HttpStatusCode } from '../interface/utils';
import { AppError } from '../utils/AppError';


export const createUser = async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  const user = await User.create({ name, email, phone, password });
  return res.status(HttpStatusCode.CREATED).json(user);
}

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  return res.status(HttpStatusCode.SUCCESS).json(users);
}

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
  }
  return res.status(HttpStatusCode.SUCCESS).json(user);
}

