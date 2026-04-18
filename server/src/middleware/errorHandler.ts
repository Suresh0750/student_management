import type { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../interface/utils";
import { AppError } from "../utils/AppError";

type AnyError = unknown & { message?: string; details?: unknown };

export default function errorHandler(err: AnyError, _req: Request, res: Response, _next: NextFunction) {
  const isAppError = err instanceof AppError;
  const status = isAppError ? err.statusCode : HttpStatusCode.INTERNAL_SERVER_ERROR;
  const message = isAppError ? err.message : "Internal server error";
  const details = isAppError ? err.details : undefined;

  if (status >= 500) {
    // keep server logs useful, but don't leak internals to clients
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return res.status(status).json({
    success: false,
    message,
    ...(details !== undefined ? { details } : {}),
  });
}

