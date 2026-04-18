import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JWT_SECRET } from "../utils/common";



type JwtPayload = {
  userId: string;
  role: string;
};

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "TVK@SURESH_0750") as JwtPayload;

    // ✅ attach to request
    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};