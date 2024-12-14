const express = require("express");
const app = express();
const logger = require("./utils/logger");
const cors = require("cors");
require("dotenv").config();
const sequilize = require("./config/db.config");

//middleware
app.use(cors());
app.use(express.json());

//database
sequilize
  .authenticate()
  .then(() => {
    logger.info("Database Connected Successfully");
    sequilize
      .sync({ force: false, alter: true }) //its doing the table sync and
      .then(() => {
        logger.info("Database Synced Successfully");
      })
      .catch((syncErr) => {
        logger.error("Error Syncing Database: " + syncErr.message);
        process.exit(1);
      });
  })
  .catch((err) => {
    logger.error("Error Connecting to Database", err);
    process.exit(1);
  });

//routes
app.use("/api", require("./routes/index"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`server is running on port ${PORT}`);
});
