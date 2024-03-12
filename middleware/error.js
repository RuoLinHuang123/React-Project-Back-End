const logger = require("../winston");

const error = function (err, req, res, next) {
  logger.error(err.message, err);

  res.status(500).send("Something Failed.");
};

module.exports = error;
