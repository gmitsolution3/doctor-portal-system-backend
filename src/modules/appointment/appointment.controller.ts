import * as appointmentService from "./appointment.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

export const createAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.createAppointment(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    status: status[status.CREATED],
    message: "Appointment booked successfully.",
    data: appointment,
  });
});
