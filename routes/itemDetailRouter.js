const express = require("express");
const ItemDetail = require("../models/itemDetail");

const router = express.Router();

router.get("/", async (req, res) => {
  const name = req.query.name;

  let itemsDetail;
  if (!name) {
    return res.status(400).send({ error: "Name parameter is required" });
  }
  itemsDetail = await ItemDetail.findOne({ name: name });
  if (!itemsDetail) {
    // If no item is found, return a 404 with a message
    return res.status(404).send({ message: "Item not found" });
  }

  return res.send(itemsDetail);
});

module.exports = router;
