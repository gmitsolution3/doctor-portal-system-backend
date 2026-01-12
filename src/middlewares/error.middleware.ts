import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export default function errorHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(error.stack);

  let statusCode = 500;
  let message = "Internal Server Error";

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    status: "error",
    message,
  });
}
