import { catchAsync } from "../../utils/catchAsync";
import * as doctorService from "./doctor-service.service";
import status from "http-status"

export const getDoctorService = catchAsync(async (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Working",
  });
});

export const createDoctorService = catchAsync(async (req, res) => {
  const serviceData = req.body;

  const result = await doctorService.createDoctorService(serviceData);

  res.status(status.CREATED).json({
    success: true,
    statusCode: status.CREATED,
    status: status[status.CREATED],
    message: "Service created successfully.",
    data: result
  })
});
