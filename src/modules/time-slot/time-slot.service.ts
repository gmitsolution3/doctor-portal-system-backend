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

// create bulk time slot
export const createTimeSlotBulk = async (
  payload: ITimeSlotPayload[]
) => {
  const newTimeSlotList = await TimeSlot.insertMany(payload);

  return newTimeSlotList;
};

// book a time slot
export const bookTimeSlot = async (id: string) => {
  const updatedDoc = {
    $set: {
      isBooked: true,
    },
  };

  const bookedTimeSlot = await TimeSlot.updateOne(
    {
      _id: id,
      isBooked: false,
    },
    updatedDoc
  );

  return bookedTimeSlot;
};

// toggle availability
export const toggleAvailability = async (id: string) => {
  const timeSlot = await TimeSlot.findOne({ _id: id });

  const updatedDoc = {
    $set: {
      isAvailable: timeSlot?.isAvailable ? false : true,
    },
  };

  const bookedTimeSlot = await TimeSlot.updateOne(
    {
      _id: id,
    },
    updatedDoc
  );

  return bookedTimeSlot;
};
