import * as timeslotService from "./time-slot.service";
import status from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "./../../utils/sendResponse";
import { AppError } from "./../../utils/AppError";
import { isValidObjectId } from "mongoose";

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
    statusCode: status.CREATED,
    status: status[status.CREATED],
    message: "Time slot created successfully",
    data: newTimeSlot,
  });
});

// create bulk time slot
export const createTimeSlotBulk = catchAsync(async (req, res) => {
  const payload = req.body;

  try {
    const newTimeSlotList = await timeslotService.createTimeSlotBulk(
      payload
    );

    if (newTimeSlotList.length < 1) {
      throw new AppError(
        400,
        "There was an error creating time slots!"
      );
    }

    sendResponse(res, {
      statusCode: status.CREATED,
      status: status[status.CREATED],
      message: "Time slots created successfully in bulk.",
      data: newTimeSlotList,
    });
  } catch (err: any) {
    if (err.name === "ValidationError") {
      const errors: {
        [key: string]: string;
      } = {};

      for (const field in err.errors) {
        errors[field] = err.errors[field].message;
      }

      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
    }
  }
});

// book a time slot
export const bookTimeSlot = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new AppError(
      status.BAD_REQUEST,
      `${id} is not a valid object id!`
    );
  }

  const bookedTimeSlot = await timeslotService.bookTimeSlot(
    id as string
  );

  if (
    bookedTimeSlot.acknowledged &&
    bookedTimeSlot.modifiedCount > 0
  ) {
    sendResponse(res, {
      statusCode: status.OK,
      status: status[status.OK],
      message: "Time slot has been booked.",
      data: bookedTimeSlot,
    });
  } else {
    sendResponse(res, {
      statusCode: status.CONFLICT,
      status: status[status.CONFLICT],
      message: "Time slot is already booked.",
      data: bookedTimeSlot,
    });
  }
});

// book a time slot
export const toggleAvailability = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new AppError(
      status.BAD_REQUEST,
      `${id} is not a valid object id!`
    );
  }

  const toggledTimeSlot = await timeslotService.toggleAvailability(
    id as string
  );

  if (
    toggledTimeSlot.acknowledged &&
    toggledTimeSlot.modifiedCount > 0
  ) {
    sendResponse(res, {
      statusCode: status.OK,
      status: status[status.OK],
      message: "Time availability has been changed.",
      data: toggledTimeSlot,
    });
  } else {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to update availability!"
    );
  }
});
