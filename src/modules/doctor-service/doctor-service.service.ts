import { IDoctorService } from "./doctor-service.interface";
import DoctorService from "./doctor-service.model";
import { ApiError } from "./../../utils/ApiError";
import status from "http-status";

export const createDoctorService = async (
  payload: IDoctorService
) => {
  const serviceExist = await DoctorService.findOne({
    title: payload.title,
  });

  if (serviceExist) {
    throw new ApiError(
      status.CONFLICT,
      "This service Already Exist!"
    );
  }

  const result = await DoctorService.create(payload);

  if (!result._id) {
    throw new ApiError(
      status.INTERNAL_SERVER_ERROR,
      "Service was not created!"
    );
  }

  return result;
};
