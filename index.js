require("express-async-errors");
const mongoose = require("mongoose");
const config = require("config");
const logger = require("./winston");
const express = require("express");
const app = express();
require("./useRoutes")(app);

process.on("uncaughtException", (ex) => {
  logger.error(ex.message, ex);
  process.exit(1);
});

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

const db = config.get('db')

mongoose
  .connect(db)
  .then(() => console.log(`Connected to ${db}...`))
  .catch((err) => console.error("MongoDB Failed to Load"));

const server = app.listen(3000);

module.exports = server;
