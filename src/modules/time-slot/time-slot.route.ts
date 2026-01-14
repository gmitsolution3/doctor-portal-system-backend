import { Router } from "express";
import * as timeslotController from "./time-slot.controller";

const router = Router();

router
  .route("/")
  .get(timeslotController.getTimeSlots)
  .post(timeslotController.createTimeSlot);

router.post("/bulk", timeslotController.createTimeSlotBulk);

export default router;
