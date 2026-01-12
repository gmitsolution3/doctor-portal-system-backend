import express from "express";
import cors from "cors";

import errorHandler from "./middlewares/error.middleware";
import router from "./routes";

const app = express();

// global middleware configuration
app.use(cors());
app.use(express.json());

// handle routes
app.use("/api/v1", router);

// handle global error
app.use(errorHandler);

export default app;
