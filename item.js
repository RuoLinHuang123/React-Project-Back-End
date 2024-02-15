const mongoose = require("mongoose");

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

module.exports = Item;
