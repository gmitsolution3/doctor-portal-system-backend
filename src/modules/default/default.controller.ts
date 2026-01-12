import status from "http-status";
import { Request, Response } from "express";

const defaultController = (_req: Request, res: Response) => {
  res.status(status.OK).json({
    success: true,
    message: "server is running...",
  });
};

export default defaultController;
