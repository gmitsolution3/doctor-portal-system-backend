import DoctorAvailability from "./doctor-availability.model";
import { generateSlots } from "./../slot/slot.service";
import { AppError } from "../../utils/AppError";

interface CreateAvailabilityPayload {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: "ONLINE" | "OFFLINE" | "BOTH";
}

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
  payload: CreateAvailabilityPayload
) => {
  const { date, startTime, endTime, type } = payload;

  // 1️⃣ Basic validation
  if (!date || !startTime || !endTime || !type) {
    throw new AppError(400, "Missing required fields");
  }

  if (startTime >= endTime) {
    throw new AppError(400, "Start time must be before end time");
  }

  // 2️⃣ Prevent exact duplicates
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

  // 3️⃣ Prevent overlapping windows of same type
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

  // 4️⃣ Create availability
  return DoctorAvailability.create({
    date,
    startTime,
    endTime,
    type,
  });
};
