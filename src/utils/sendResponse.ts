import { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  status: string;
  message?: string;
  data?: T;
};

/**
 * Send response back to client.
 *
 * @param {Response} res The response object from express
 * @param {TResponse} payload The payload to send to client.
 */
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
