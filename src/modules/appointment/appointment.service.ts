import Appointment from "./appointment.model";
import { AppError } from "../../utils/AppError";
import DoctorAvailability from "./../doctor-availability/doctor-availability.model";
import { IAppointmentPayload } from "./appointment.interface";

export const createAppointment = async (
  payload: IAppointmentPayload
) => {
  const { date, startTime, endTime, type } = payload;

  const availabilityExists = await DoctorAvailability.findOne({
    date,
    isActive: true,
    type: { $in: [type] },
    startTime: { $lte: startTime },
    endTime: { $gte: endTime },
  });

  if (!availabilityExists) {
    throw new AppError(400, "Slot is not available");
  }

  const alreadyBooked = await Appointment.findOne({
    date,
    startTime,
    status: "BOOKED",
  });

  if (alreadyBooked) {
    throw new AppError(409, "Slot already booked!");
  }

  return await Appointment.create({
    ...payload,
    status: "BOOKED",
  });
};
