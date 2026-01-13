import status from "http-status";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";

const defaultController = (_req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: status.OK,
    status: status[status.OK],
    message: "Server is running...",
  });
};

export default defaultController;
