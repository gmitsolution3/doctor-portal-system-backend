import { Request, Response, NextFunction } from "express";

export default function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(error.stack);

  const statusCode = error.statusCode || 500;
  const errorMessage =
    error.message || "An unexpected error occurred";

  res.status(statusCode).json({
    success: false,
    status: "error",
    message: errorMessage,
  });
}
