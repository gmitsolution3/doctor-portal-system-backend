import { Router } from "express";
import defaultController from "../modules/default/default.controller";

import timeslotRoute from "../modules/time-slot/time-slot.route";
import dateslotRoute from "../modules/date-slot/date-slot.route";
import doctorServiceRoute from "../modules/doctor-service/doctor-service.route";

const router = Router();

router.get("/", defaultController);
router.use("/doctor-service", doctorServiceRoute);
router.use("/time-slot", timeslotRoute);
router.use("/date-slot", dateslotRoute);

export default router;
