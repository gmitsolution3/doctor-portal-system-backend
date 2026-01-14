import { Router } from "express";
import * as timeslotController from "./time-slot.controller";

const router = Router();

// create and get time slot
router
  .route("/")
  .get(timeslotController.getTimeSlots)
  .post(timeslotController.createTimeSlot);

// book a time slot
router.patch("/book/:id", timeslotController.bookTimeSlot);

// toggle availability of a time slot
router.patch(
  "/toggle-available/:id",
  timeslotController.toggleAvailability
);

// create bulk time slot
router.post("/bulk", timeslotController.createTimeSlotBulk);

export default router;
