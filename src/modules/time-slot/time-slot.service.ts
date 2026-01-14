import TimeSlot from "./time-slot.model";
import { ITimeSlotPayload } from "./time-slot.interface";

// get all time slots - online, offline both
export const getTimeSlots = async (status: string) => {
  const timeSlotList = await TimeSlot.find({ status });

  return timeSlotList;
};

export const createTimeSlot = async (payload: ITimeSlotPayload) => {
  const timeSlotExist = await TimeSlot.findOne(payload);

  if (timeSlotExist) {
    return false;
  }

  const newTimeSlot = await TimeSlot.create(payload);

  return newTimeSlot;
};
