import { Router } from "express";
import * as availabilityController from "./doctor-availability.controller";

const router = Router();

router.get("/dates", availabilityController.getDates);
router.get("/by-date", availabilityController.getByDate);
router.get("/slots/generate", availabilityController.getSlots);

router.post("/", availabilityController.createAvailability);

router.post(
  "/range",
  availabilityController.createAvailabilityByRange
);

export default router;
