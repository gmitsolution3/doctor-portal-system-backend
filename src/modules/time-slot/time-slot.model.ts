import { Schema, model } from "mongoose";
import { ITimeSlot } from "./time-slot.interface";

const timeSlotSchema = new Schema<ITimeSlot>(
  {
    time: {
      type: String,
      requied: [true, "Time is required!"],
    },
    isBooked: {
      type: Boolean,
      required: [true, "Booking status is required!"],
      default: false,
    },
    isAvailable: {
      type: Boolean,
      required: [true, "Availability is required!"],
      default: true,
    },
    status: {
      type: String,
      required: [true, "Status is required!"],
      enum: {
        values: ["online", "offline"],
        message: "{VALUE} is not a valid status!",
      },
    },
  },
  {
    strict: true,
    timestamps: true,
    versionKey: false,
  }
);

const TimeSlot = model("TimeSlot", timeSlotSchema);

export default TimeSlot;
