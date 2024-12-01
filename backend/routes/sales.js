const express = require('express');
const router = express.Router();
const Sale = require('../models/salesModel');
const Inventory = require('../models/inventoryModel');

// Fixed prices for products
// Fixed prices for products
const productPrices = {
    Classic: 46,
    Spicy: 47,
    Roasted: 250,
  };
  
  // Add a new sale
  router.post('/', async (req, res) => {
    const { productName, quantity } = req.body;
  
    try {
      const product = await Inventory.findOne({ productName });
  
      if (!product) {
        return res.status(400).json({ message: 'Product not found in inventory' });
      }
  
      if (product.quantity < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
  
      // Calculate total price
      const totalPrice = quantity * (productPrices[productName] || 0);
      if (totalPrice === 0) {
        return res.status(400).json({ message: 'Invalid product name' });
      }
  
      const sale = new Sale({ productName, quantity, totalPrice });
      const newSale = await sale.save();
  
      product.quantity -= quantity;
      await product.save();
  
      res.status(201).json(newSale);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  router.get('/', async (req, res) => {
    try {
      const sales = await Sale.find(); // Fetch all sales
      res.json(sales); // Send sales data as JSON
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

// Delete a sale
router.delete('/:id', async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
