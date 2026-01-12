import { Router } from "express";
import defaultController from "../modules/default/default.controller";
import doctorServiceRoute from "../modules/doctor-service/doctor-service.route";

const router = Router();

router.get("/", defaultController);
router.use("/doctor-service", doctorServiceRoute);

export default router;
