const express = require('express');
const router = express.Router();
const Sale = require('../models/salesModel');
const Inventory = require('../models/inventoryModel');

// Get all sales
router.get('/', async (req, res) => {
    try {
      const sales = await Sale.find();
      res.json(sales);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
// Fixed prices for products
// Fixed prices for products
const productPrices = {
    Classic: 46,
    Spicy: 47,
    Roasted: 250,
  };
  
  // Add a new sale
  // Add a new sale
  router.post('/', async (req, res) => {
    const { productName, quantity } = req.body;
  
    try {
      // Check if the product exists
      const product = await Inventory.findOne({ productName });
      if (!product) {
        return res.status(400).json({ message: 'Product not found in inventory' });
      }
  
      if (quantity < 0) {
        return res.status(400).json({ message: 'Quantity cannot be negative' });
      }
  
      // Calculate total price
      const totalPrice = quantity * (productPrices[productName] || 0);
      if (totalPrice === 0) {
        return res.status(400).json({ message: 'Invalid product name' });
      }
  
      // Add the sale without modifying inventory
      const sale = new Sale({ productName, quantity, totalPrice });
      const newSale = await sale.save();
  
      res.status(201).json(newSale);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
    
  // Dashboard totals calculation
router.get('/dashboard', async (req, res) => {
    try {
      const inventory = await Inventory.find(); // Get all inventory
      const sales = await Sale.find(); // Get all sales
  
      // Aggregate sales quantities by product name
      const salesMap = sales.reduce((acc, sale) => {
        acc[sale.productName] = (acc[sale.productName] || 0) + sale.quantity;
        return acc;
      }, {});
  
      // Calculate remaining stock for dashboard
      const dashboardTotals = inventory.map(product => {
        const soldQuantity = salesMap[product.productName] || 0;
        return {
          productName: product.productName,
          total: product.quantity - soldQuantity,
        };
      });
  
      res.json(dashboardTotals);
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
