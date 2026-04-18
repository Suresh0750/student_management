import type { NextFunction, Request, Response, RequestHandler } from "express";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => unknown | Promise<unknown>;

export default function handleRequest(handler: AsyncHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

