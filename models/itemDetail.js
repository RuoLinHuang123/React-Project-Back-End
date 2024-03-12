const mongoose = require("mongoose");

itemDetailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  properties: {
    type: Array,
    required: true,
  },
  detailPicUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const ItemDetail = mongoose.model("itemDetails", itemDetailSchema);

module.exports = ItemDetail;
