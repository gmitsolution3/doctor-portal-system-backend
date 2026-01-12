import app from "./app";
import config from "./config";

app.listen(config.port, () => {
  console.log(`server is runnning at port ${config.port}`);
});
