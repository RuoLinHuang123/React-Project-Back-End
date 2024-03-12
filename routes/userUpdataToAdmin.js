const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/user");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("Invalid User.");

  user.isAdmin = true;
  await user.save();

  const token = user.generateAuthToken();
  res.send({ token: token });
});

module.exports = router;
