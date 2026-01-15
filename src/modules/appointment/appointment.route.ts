// appointment.route.ts
import { Router } from "express";
import * as appointmentController from "./appointment.controller";

const router = Router();

router.post("/", appointmentController.createAppointment);

export default router;
