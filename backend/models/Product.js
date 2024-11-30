const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },       // Product name (e.g., Classic Chicken)
  price: { type: Number, required: true },      // Product price (e.g., 46)
  qty: { type: Number, required: true, default: 0 },  // Available quantity in stock
  createdAt: { type: Date, default: Date.now }, // Date when product was created
  updatedAt: { type: Date, default: Date.now }, // Date when product was last updated
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();  // Automatically update 'updatedAt' before saving the document
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
