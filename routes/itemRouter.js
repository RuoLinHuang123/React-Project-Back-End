const express = require("express");
const Item = require("../models/item");
const router = express.Router();

router.get("/", async (req, res) => {
  const items = await Item.find().sort("name");
  res.send(items);
});

module.exports = router;
