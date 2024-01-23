const express = require("express");
const { number } = require("joi");
const mongoose = require("mongoose");
const Joi = require("joi");

const router = express.Router();

itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mass: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Planet", "Dwarf Planet", "Moon"],
  },
  picUrl: {
    type: String,
    required: true,
  },
});

const Item = mongoose.model("items", itemSchema);

function validateItem(item) {
  const schema = Joi.object ({
    name: Joi.string().required().trim(),
    mass: Joi.number().unsafe().required(),
    category: Joi.string()
      .required()
      .valid("Planet", "Dwarf Planet", "Moon"), // specify your categories
    picUrl: Joi.string().required(),
  });
  return schema.validate(item);
}

router.get("/", async (req, res) => {
  const items = await Item.find().sort("name");
  res.send(items);
});

router.post('/', async (req, res) => {
  const { error } = validateItem(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const exist = await Item.find({ name: req.body.name });
  if (exist[0]) return res.status(400).send(`Item ${req.body.name} already exists.`);

  const item = new Item({ 
    name: req.body.name,
    mass: req.body.mass,
    category: req.body.category,
    picUrl: req.body.picUrl
  });
  await item.save();
  
  res.send(item);
});

router.put('/', async (req, res) => {

  const { error } = validateItem(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const exist = await Item.find({ name: req.body.name });
  if (!exist[0]) return res.status(400).send('Item not exists.');

  item = exist[0]

  item.mass = req.body.mass;
  item.category = req.body.category;
  item.picUrl = req.body.picUrl;
  await item.save()

  res.send(exist);
});


module.exports = router;
