import { Router } from "express";
import * as doctorServiceController from "./doctor-service.controller";

const router = Router();

router
  .route("/")
  .get(doctorServiceController.getDoctorService)
  .post(doctorServiceController.createDoctorService);

export default router;
