import { Router } from "express";
import defaultController from "../modules/default/default.controller";
import doctorServiceRoute from "../modules/doctor-service/doctor-service.route";
import doctorAvailaabilityRoute from "../modules/doctor-availability/doctor-availability.route";
import appointmentRoute from "../modules/appointment/appointment.route";

const router = Router();

router.get("/", defaultController);
router.use("/doctor-service", doctorServiceRoute);
router.use("/doctor-availability", doctorAvailaabilityRoute);
router.use("/appointment", appointmentRoute);

export default router;
