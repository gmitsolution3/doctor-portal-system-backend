import express from "express";
import cors from "cors";
import connectDB from "./config/database";

import errorHandler from "./middlewares/error.middleware";

// application configuration
const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
connectDB();

// handle global error
app.use(errorHandler);

export default app;
