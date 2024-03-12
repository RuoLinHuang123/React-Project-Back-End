const express = require("express");
const ItemDetail = require("../models/itemDetail");
const Item = require("../models/item");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

const router = express.Router();

router.delete("/", [auth,admin], async (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.status(400).send({ error: "Name parameter is required" });
  }
  const item = await Item.findOneAndDelete({ name: name });

  if (!item) {
    return res.status(404).send("The item with the given ID was not found.");
  }

  await ItemDetail.findOneAndDelete({ name: name });

  res.send(item);
});

module.exports = router;
