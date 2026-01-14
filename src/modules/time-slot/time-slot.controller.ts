import * as timeslotService from "./time-slot.service";
import status from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "./../../utils/sendResponse";
import { AppError } from "./../../utils/AppError";

// get all time slots - online, offline both
export const getTimeSlots = catchAsync(async (req, res) => {
  const { status: timeStatus } = req.query;

  if (!timeStatus) {
    throw new AppError(
      status.BAD_REQUEST,
      "Status query is required!"
    );
  }

  if (!["online", "offline"].includes(timeStatus as string)) {
    throw new AppError(
      status.BAD_REQUEST,
      `${timeStatus} is not a valid status!`
    );
  }

  const timeSlotList = await timeslotService.getTimeSlots(
    timeStatus as string
  );

  if (timeSlotList.length < 1) {
    return sendResponse(res, {
      statusCode: status.OK,
      status: status[status.OK],
      message: "No Timeslot available for now!",
      data: timeSlotList,
    });
  }

  sendResponse(res, {
    statusCode: status.OK,
    status: status[status.OK],
    message: "All time slot list.",
    data: timeSlotList,
  });
});

// create new time slot
export const createTimeSlot = catchAsync(async (req, res) => {
  const payload = req.body;

  const newTimeSlot = await timeslotService.createTimeSlot(payload);

  if (!newTimeSlot) {
    throw new AppError(status.CONFLICT, "Time slot already exist!");
  }

  sendResponse(res, {
    statusCode: status.OK,
    status: status[status.OK],
    message: "Time slot created successfully",
    data: newTimeSlot,
  });
});