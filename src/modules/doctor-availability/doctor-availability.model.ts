import { Schema, model } from "mongoose";
import { IDoctorAvailability } from "./doctor-availability.interface";

const doctorAvailabilitySchema = new Schema<IDoctorAvailability>(
  {
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    type: {
      type: String,
      enum: ["ONLINE", "OFFLINE", "BOTH"],
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { strict: true, timestamps: true, versionKey: false }
);

const DoctorAvailability = model(
  "DoctorAvailability",
  doctorAvailabilitySchema
);

export default DoctorAvailability;
