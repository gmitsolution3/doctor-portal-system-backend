import { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  status: string;
  message?: string;
  data?: T;
};

export const sendResponse = <T>(
  res: Response,
  payload: TResponse<T>
) => {
  res.status(payload.statusCode).json({
    success: true,
    statusCode: payload.statusCode,
    status: payload.status,
    message: payload.message,
    data: payload.data,
  });
};
