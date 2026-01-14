import { Schema, model } from "mongoose";
import { IDoctorService } from "./doctor-service.interface";

const doctorServiceSchema = new Schema<IDoctorService>(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
    },
    image: {
      type: String,
      required: [true, "Image is required!"],
    },
  },
  {
    strict: true,
    timestamps: true,
    versionKey: false,
  }
);

const DoctorService = model("DoctorService", doctorServiceSchema);

export default DoctorService;
