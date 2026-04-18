import { Response, NextFunction } from "express";
import { AuthRequest } from "../utils/common";

export const authorizeRoles = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.role) {
        return res.status(403).json({ message: "Role not found" });
      }

      if (!allowedRoles.includes(req.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  };
};