import { Schema, model } from "mongoose";
import { IAppointment } from "./appointment.interface";

const appointmentSchema = new Schema<IAppointment>(
  {
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    type: {
      type: String,
      enum: ["ONLINE", "OFFLINE"],
      required: true,
    },
    status: {
      type: String,
      enum: ["BOOKED", "CANCELLED"],
      default: "BOOKED",
    },
    patientName: {
      type: String,
      required: true,
    },
    patientEmail: {
      type: String,
      required: true,
    },
    patientPhone: {
      type: String,
      required: true,
    },
    patientGender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    patientDateOfBirth: {
      type: Date,
      required: true,
    },
    patientProblem: {
      type: String,
      required: true,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    consultationZoomLink: {
      type: String,
      required: false,
    },
  },
  { strict: true, timestamps: true, versionKey: false },
);

const Appointment = model("Appointment", appointmentSchema);
export default Appointment;
