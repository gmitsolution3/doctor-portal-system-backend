import { Types } from "mongoose";

export interface IDoctorAvailability {
  _id?: Types.ObjectId;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: "ONLINE" | "OFFLINE" | "BOTH";
  isActive: boolean;
}
