import { Types } from "mongoose";

export interface IAppointment {
  _id: Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  type: "ONLINE" | "OFFLINE";
  status: "BOOKED" | "CANCELLED";
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientGender: "male" | "female" | "other";
  patientDateOfBirth: Date;
  patientProblem: string;
}
