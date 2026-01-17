import DoctorAvailability from "./doctor-availability.model";
import { generateSlots } from "./../slot/slot.service";
import { AppError } from "../../utils/AppError";
import dayjs from "dayjs";
import { ICreateAvailabilityPayload, ICreateRangePayload } from "./doctor-availability.interface";

const DAY_MAP: Record<string, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

export const getAvailableDates = async (
  type: "ONLINE" | "OFFLINE"
) => {
  const dates = await DoctorAvailability.distinct("date", {
    isActive: true,
  });

  const timeWindow = await DoctorAvailability.find({
    isActive: true,
    type,
    date: {
      $gte: new Date().toISOString().slice(0, 10),
    },
  });

  return {
    dates,
    timeWindow,
  };
};

export const getAvailabilityByDate = async (
  date: string,
  type: "ONLINE" | "OFFLINE"
) => {
  return DoctorAvailability.find({
    date,
    isActive: true,
    type: { $in: [type] },
  }).sort({ startTime: 1 });
};

export const getSlotsForAvailability = async (
  date: string,
  type: "ONLINE" | "OFFLINE",
  startTime: string,
  endTime: string
) => {
  const SLOT_DURATION = 20; // minutes (configurable)
  return generateSlots(date, type, startTime, endTime, SLOT_DURATION);
};

export const createAvailability = async (
  payload: ICreateAvailabilityPayload
) => {
  const { date, startTime, endTime, type } = payload;

  //  Basic validation
  if (!date || !startTime || !endTime || !type) {
    throw new AppError(400, "Missing required fields");
  }

  if (startTime >= endTime) {
    throw new AppError(400, "Start time must be before end time");
  }

  //  Prevent exact duplicates
  const exactExists = await DoctorAvailability.findOne({
    date,
    startTime,
    endTime,
    type,
    isActive: true,
  });

  if (exactExists) {
    throw new AppError(409, "Availability already exists");
  }

  // 3 Prevent overlapping windows of same type
  const overlapping = await DoctorAvailability.findOne({
    date,
    isActive: true,
    type: { $in: [type] },
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      {
        $and: [
          { startTime: { $lte: startTime } },
          { endTime: { $gte: endTime } },
        ],
      },
    ],
  });

  if (overlapping) {
    throw new AppError(
      409,
      "Availability overlaps with existing schedule"
    );
  }

  //  Create availability
  return DoctorAvailability.create({
    date,
    startTime,
    endTime,
    type,
  });
};

export const createAvailabilityByRange = async (
  payload: ICreateRangePayload
) => {
  const { startDate, endDate, daysOfWeek, timeWindows } = payload;

  if (!timeWindows?.length) {
    throw new AppError(400, "At least one time window is required");
  }

  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (end.isBefore(start)) {
    throw new AppError(400, "End date must be after start date");
  }

  const validDays = daysOfWeek.map((d) => DAY_MAP[d]);

  if (validDays.some((d) => d === undefined)) {
    throw new AppError(400, "Invalid day of week");
  }

  // Validate time windows
  for (const w of timeWindows) {
    if (w.startTime >= w.endTime) {
      throw new AppError(400, "Invalid time window");
    }
  }

  //  Generate dates
  const dates: string[] = [];
  let current = start;

  while (current.isSameOrBefore(end)) {
    if (validDays.includes(current.day())) {
      dates.push(current.format("YYYY-MM-DD"));
    }
    current = current.add(1, "day");
  }

  if (!dates.length) {
    throw new AppError(400, "No matching dates found");
  }

  //  Prepare docs
  const docs: any[] = [];

  for (const date of dates) {
    for (const window of timeWindows) {
      docs.push({
        date,
        startTime: window.startTime,
        endTime: window.endTime,
        type: window.type,
      });
    }
  }

  //  Remove duplicates (IMPORTANT)
  const existing = await DoctorAvailability.find({
    date: { $in: dates },
    $or: timeWindows.map((w) => ({
      startTime: w.startTime,
      endTime: w.endTime,
      type: w.type,
      isActive: true,
    })),
  });

  const existingKey = new Set(
    existing.map(
      (e) => `${e.date}-${e.startTime}-${e.endTime}-${e.type}`
    )
  );

  const filteredDocs = docs.filter(
    (d) =>
      !existingKey.has(
        `${d.date}-${d.startTime}-${d.endTime}-${d.type}`
      )
  );

  return DoctorAvailability.insertMany(filteredDocs);
};
