import { Router } from "express";
import defaultController from "../modules/default/default.controller";

import timeslotRoute from "../modules/time-slot/time-slot.route";
import doctorServiceRoute from "../modules/doctor-service/doctor-service.route";

const router = Router();

router.get("/", defaultController);
router.use("/doctor-service", doctorServiceRoute);
router.use("/time-slot", timeslotRoute);

export default router;
