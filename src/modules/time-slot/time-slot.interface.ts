import { Types } from "mongoose";

type TStatus = "online" | "offline";

export interface ITimeSlot {
  _id?: Types.ObjectId;
  time: string;
  isBooked: boolean;
  isAvailable: boolean;
  status: TStatus;
}

export interface ITimeSlotPayload {
  time: string;
  status: string;
}
