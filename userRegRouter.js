const _ = require("lodash");
const express = require("express");
const User = require("./user");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(15),
    email: Joi.string().required().email().min(5).max(255),
    password: Joi.string().required().min(5).max(255),
  });
  return schema.validate(user);
}

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
