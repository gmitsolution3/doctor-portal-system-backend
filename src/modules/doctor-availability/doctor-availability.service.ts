import DoctorAvailability from "./doctor-availability.model";
import { generateSlots } from "./../slot/slot.service";
import { AppError } from "../../utils/AppError";
import dayjs from "dayjs";
import {
  ICreateAvailabilityPayload,
  ICreateRangePayload,
} from "./doctor-availability.interface";
import { normalizeTo24Hour } from "../../utils/notmalizeTime";

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

  const normalizedStartTime = normalizeTo24Hour(startTime);
  const normalizedEndTime = normalizeTo24Hour(endTime);

  if (normalizedStartTime >= normalizedEndTime) {
    throw new AppError(400, "Start time must be before end time");
  }

  //  Prevent exact duplicates
  const exactExists = await DoctorAvailability.findOne({
    date,
    startTime: normalizedStartTime,
    endTime: normalizedEndTime,
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
      { startTime: { $lt: normalizedEndTime, $gte: normalizedStartTime } },
      { endTime: { $gt: normalizedStartTime, $lte: normalizedEndTime } },
      {
        $and: [
          { startTime: { $lte: normalizedStartTime } },
          { endTime: { $gte: normalizedEndTime } },
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
    startTime: normalizedStartTime,
    endTime: normalizedEndTime,
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

  if (!start.isValid() || !end.isValid()) {
    throw new AppError(400, "Invalid date format");
  }

  if (end.isBefore(start)) {
    throw new AppError(400, "End date must be after start date");
  }

  // 2️⃣ Validate days of week
  const validDays = daysOfWeek.map((d) => DAY_MAP[d]);

  if (validDays.some((d) => d === undefined)) {
    throw new AppError(400, "Invalid day of week");
  }

  // 3️⃣ Normalize & validate time windows (CRITICAL PART)
  const normalizedTimeWindows = timeWindows.map((w) => {
    const startTime = normalizeTo24Hour(w.startTime);
    const endTime = normalizeTo24Hour(w.endTime);

    if (startTime >= endTime) {
      throw new AppError(
        400,
        `Invalid time window ${w.startTime} - ${w.endTime}`
      );
    }

    return {
      startTime,
      endTime,
      type: w.type,
    };
  });

  // 4️⃣ Generate dates
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

  // 5️⃣ Prepare availability documents
  const docs: any[] = [];

  for (const date of dates) {
    for (const window of normalizedTimeWindows) {
      docs.push({
        date,
        startTime: window.startTime, // always HH:mm
        endTime: window.endTime,     // always HH:mm
        type: window.type,
      });
    }
  }

  // 6️⃣ Remove duplicates
  const existing = await DoctorAvailability.find({
    date: { $in: dates },
    isActive: true,
    $or: normalizedTimeWindows.map((w) => ({
      startTime: w.startTime,
      endTime: w.endTime,
      type: w.type,
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

  if (!filteredDocs.length) {
    throw new AppError(409, "All availability already exists");
  }

  // 7️⃣ Insert
  return DoctorAvailability.insertMany(filteredDocs);
};
