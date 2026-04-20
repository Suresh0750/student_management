import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JWT_SECRET } from "../utils/common";
import { IRole } from "../interface/users";



type JwtPayload = {
  userId: string;
  role: string;
};


export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided", code: "NO_TOKEN" });
    }
    console.log(JWT_SECRET, "JWT_SECRET");
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.userId = decoded.userId;
    req.role = decoded.role as IRole;

    next();
  } catch (error: any) {
    // ── Distinguish expiry from invalid token ──────────────────
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired", code: "TOKEN_EXPIRED" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token", code: "INVALID_TOKEN" });
    }
    return res.status(401).json({ success: false, message: "Authentication failed", code: "AUTH_FAILED" });
  }
};