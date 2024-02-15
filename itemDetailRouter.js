const express = require("express");
const ItemDetail = require("./itemDetail");

const router = express.Router();

router.get("/", async (req, res) => {
  const name = req.query.name;

  let itemsDetail;
  if (name) {
    // Find items that match the given name
    itemsDetail = await ItemDetail.findOne({ name: name });
  } else {
    // If no name is provided, return all items
    return res.status(400).send({ error: "Name parameter is required" });
  }
  res.send(itemsDetail)

});


module.exports = router;
