const itemRouter = require("./routes/itemRouter");
const itemDetailRouter = require("./routes/itemDetailRouter");
const itemSubmitlRouter = require("./routes/itemSubmitRouter");
const userRegrouter = require("./routes/userRegRouter");
const userLoginrouter = require("./routes/userLogInRouter");
const itemDeleteRouter = require("./routes/itemDeleteRouter");
const userUpdataToAdmin = require("./routes/userUpdataToAdmin");
const acessControl = require("./middleware/accessControl");
const express = require("express");
const error = require("./middleware/error");

module.exports = function (app) {
  app.use(acessControl);
  app.use(express.json());
  app.use("/api/items", itemRouter);
  app.use("/api/itemDetails", itemDetailRouter);
  app.use("/api/itemSubmission", itemSubmitlRouter);
  app.use("/api/itemDelete", itemDeleteRouter);
  app.use("/api/userRegister", userRegrouter);
  app.use("/api/userLogin", userLoginrouter);
  app.use("/api/updataToAdmin",userUpdataToAdmin)
  app.use(error);
};
