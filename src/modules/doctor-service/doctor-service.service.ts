import { IDoctorService } from "./doctor-service.interface";
import DoctorService from "./doctor-service.model";
import { AppError } from "../../utils/AppError";
import status from "http-status";

export const createDoctorService = async (
  payload: IDoctorService
) => {
  const serviceExist = await DoctorService.findOne({
    title: payload.title,
  });

  if (serviceExist) {
    throw new AppError(
      status.CONFLICT,
      "This service Already Exist!"
    );
  }

  const result = await DoctorService.create(payload);

  if (!result._id) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Service was not created!"
    );
  }

  return result;
};
