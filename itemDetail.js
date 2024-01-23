const express = require("express");
const { number } = require("joi");
const mongoose = require("mongoose");
const Joi = require("joi");

const router = express.Router();

itemDetailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  detailPicUrl: {
    type: String,
    required: true,
  },
  properties: {
    mass: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Planet", "Dwarf Planet", "Moon"],
    },
  },
  description: {
    type: String,
    required: true,
  },
});

function validateItemDetail(itemDetail) {
  const Schema = Joi.object({
    name: Joi.string().trim().required(),
    detailPicUrl: Joi.string().required(),
    properties: Joi.object({
      mass: Joi.number().unsafe().required(),
      category: Joi.string().valid("Planet", "Dwarf Planet", "Moon").required(),
    }).required(),
    description: Joi.string().required(),
  });
  return Schema.validate(itemDetail);
}

const ItemDetail = mongoose.model("itemDetails", itemDetailSchema);

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
    res.send(itemsDetail);
});

router.post('/', async (req, res) => {
    const { error } = validateItemDetail(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const exist = await ItemDetail.findOne({ name: req.body.name });
    if (exist) return res.status(400).send(`Item ${req.body.name} already exists.`);
  
    const itemDetail = new ItemDetail({ 
      name: req.body.name,
      properties: req.body.properties,
      detailPicUrl: req.body.detailPicUrl,
      description: req.body.description
    });
    await itemDetail.save();
    
    res.send(itemDetail);
  });


module.exports = router;

