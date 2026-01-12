import { Router } from "express";
import defaultController from "./default.controller";

const router = Router();

router.get("/", defaultController);

export default router;
