import { Types } from "mongoose";

export interface IDoctorService {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  image: string;
}
