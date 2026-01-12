import mongoose from "mongoose";

import config from ".";

export default async function connectDB() {
  mongoose
    .connect(config.mongoURI, config.databaseConfig)
    .then(() => console.log("Database connected!"))
    .catch((error) => console.log(`Database error: ${error}`));
}
