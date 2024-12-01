// models/inventoryModel.js
const mongoose = require('mongoose');

// Define a schema for the inventory
const inventorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Custom sequential ID
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Inventory', inventorySchema);
