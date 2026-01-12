import { Router } from "express";
import defaultController from "../modules/default/default.controller";

const router = Router();

router.use("/", defaultController);

export default router;
