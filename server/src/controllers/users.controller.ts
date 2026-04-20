import { Request, Response } from 'express';
import User from '../models/user.schema';
import { HttpStatusCode } from '../interface/utils';
import { AppError } from '../utils/AppError';


export const createUser = async (req: Request, res: Response) => {
  const { name, email, phone, password, role } = req.body;
  const user = await User.create({ name, email, phone, password, role });

  return res.status(HttpStatusCode.CREATED).json({
    success: true,
    user,
    message: `success fully created ${role?.toLowerCase()}`
  });
}


export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
  }
  return res.status(HttpStatusCode.SUCCESS).json(user);
}

export const getUsers = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const role = req.query.role; // optional filter

    const skip = (page - 1) * limit;

    // filter
    const filter: any = {};
    if (role) {
      filter.role = role;
    }

    // query
    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: users,
    });
  } catch (err) {
    next(err);
  }
};


export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, password, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, password, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(HttpStatusCode.SUCCESS).json({
      success: true,
      user: updatedUser,
      message: `Successfully updated ${updatedUser.role?.toLowerCase()}`,
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(HttpStatusCode.SUCCESS).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};