import { Request, Response, NextFunction } from 'express';
import User from '../models/user.schema';
import { HttpStatusCode } from '../interface/utils';
import { AppError } from '../utils/AppError';
import { hashPassword } from '../utils/service';



export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, phone, password: hashedPassword, role });

    return res.status(HttpStatusCode.CREATED).json({
      success: true,
      user,
      message: `successfully created ${role?.toLowerCase() || 'user'}`
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "User with this email already exists."
      });
    }
    next(error);
  }
}


export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
  }
  return res.status(HttpStatusCode.SUCCESS).json(user);
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const role = req.query.role; // optional filter

    const skip = (page - 1) * limit;

    // filter
    const filter: any = { isDeleted: false };
    if (role) {
      filter.role = role;
    }
    console.log(filter, "queryfilter");

    // query
    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasPrevPage: page > 1,
        hasNextPage: page < Math.ceil(total / limit),
      }
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

    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(HttpStatusCode.SUCCESS).json({
      success: true,
      user,
      message: "User deleted successfully (soft delete)",
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};