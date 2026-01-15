import { catchAsync } from "../../utils/catchAsync";
import * as availabilityService from "./doctor-availability.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

export const getDates = catchAsync(async (req, res) => {
  const { type } = req.query;

  const data = await availabilityService.getAvailableDates(
    type as "ONLINE" | "OFFLINE"
  );

  sendResponse(res, {
    statusCode: status.OK,
    status: status[status.OK],
    message: "All dates doctor available on.",
    data,
  });
});

export const getByDate = catchAsync(async (req, res) => {
  const { date, type } = req.query;
  const availability =
    await availabilityService.getAvailabilityByDate(
      date as string,
      type as "ONLINE" | "OFFLINE"
    );

  sendResponse(res, {
    statusCode: status.OK,
    status: status[status.OK],
    message: "All doctor available time.",
    data: availability,
  });
});

export const getSlots = catchAsync(async (req, res) => {
  const { date, type, startTime, endTime } = req.query as {
    date: string;
    type: "ONLINE" | "OFFLINE";
    startTime: string;
    endTime: string;
  };

  const slots = await availabilityService.getSlotsForAvailability(
    date,
    type,
    startTime,
    endTime
  );

  sendResponse(res, {
    statusCode: status.OK,
    status: status[status.OK],
    message: "All time slots.",
    data: slots,
  });
});

export const createAvailability = catchAsync(async (req, res) => {
  const result = await availabilityService.createAvailability(
    req.body
  );

  sendResponse(res, {
    statusCode: status.CREATED,
    status: status[status.CREATED],
    message: "Time slot created",
    data: result,
  });
});

export const createAvailabilityByRange = catchAsync(
  async (req, res) => {
    const result =
      await availabilityService.createAvailabilityByRange(req.body);

    sendResponse(res, {
      statusCode: status.CREATED,
      status: status[status.CREATED],
      message: "Time created slot created by range",
      data: result,
    });
  }
);
