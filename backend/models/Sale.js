const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  totalAmount: { type: Number, required: true }, // Total amount for the sale
  paymentAmount: { type: Number, required: true }, // Payment made by the customer
  changeAmount: { type: Number, required: true },  // Change to be returned to the customer
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  // Reference to Product
      name: { type: String, required: true },     // Name of the product
      price: { type: Number, required: true },    // Price of the product
      qty: { type: Number, required: true },      // Quantity of the product purchased
    },
  ],
  date: { type: Date, default: Date.now }, // Date of the sale transaction
  createdAt: { type: Date, default: Date.now }, // Date the sale document was created
});

saleSchema.pre('save', function(next) {
  this.createdAt = Date.now();  // Automatically set the createdAt field when saving a new sale
  next();
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
