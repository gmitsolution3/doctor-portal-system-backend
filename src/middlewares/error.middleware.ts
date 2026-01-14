import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import status from "http-status";

export default function errorHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(error.stack);

  let statusCode = 500;
  let message = error.message || "Internal Server Error";

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    status: status[statusCode],
    message,
  });
}
