const _ = require("lodash");
const express = require("express");
const Joi = require("joi");
const Item = require("../models/item");
const ItemDetail = require("../models/itemDetail");
const router = express.Router();
const auth = require("../middleware/auth");

function validateItem(item) {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    category: Joi.string().required().valid("Planet", "Dwarf Planet", "Moon"),
    mass: Joi.number().unsafe().required(),
    properties: Joi.array(),
    picUrl: Joi.string().required(),
    detailPicUrl: Joi.string().required(),
    description: Joi.string().required(),
  });
  return schema.validate(item);
}

router.post("/", auth, async (req, res) => {
  const { error } = validateItem(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const exist = await Item.find({ name: req.body.name });
  if (exist[0])
    return res.status(400).send(`Item ${req.body.name} already exists.`);

  const item = new Item(
    _.pick(req.body, ["name", "mass", "category", "picUrl"])
  );
  await item.save();

  const itemDetailData = _.pick(req.body, [
    "name",
    "detailPicUrl",
    "description",
  ]);
  const itemDetail = new ItemDetail({
    ...itemDetailData,
    properties: [
      {
        name: "Mass",
        value: req.body.mass,
        unit: "Kg",
      },
      {
        name: "Category",
        value: req.body.category,
      },
    ],
  });
  itemDetail.properties = itemDetail.properties.concat(req.body.properties);
  await itemDetail.save();

  res.send(item);
});

module.exports = router;
