import { Types } from "mongoose";

export interface IDoctorAvailability {
  _id?: Types.ObjectId;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: "ONLINE" | "OFFLINE" | "BOTH";
  isActive: boolean;
}

export interface ICreateAvailabilityPayload {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: "ONLINE" | "OFFLINE" | "BOTH";
}

export interface ITimeWindow {
  startTime: string;
  endTime: string;
  type: "ONLINE" | "OFFLINE" | "BOTH";
}

export interface ICreateRangePayload {
  startDate: string;
  endDate: string;
  daysOfWeek: string[];
  timeWindows: ITimeWindow[];
}