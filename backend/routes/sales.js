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
    Roasted: 300,
  };
  
  // Add a new sale
  router.post('/pos', async (req, res) => {
    const { sales } = req.body; // Array of products with productName and quantity
  
    if (!sales || !Array.isArray(sales)) {
      return res.status(400).json({ message: 'Invalid sales data format' });
    }
  
    try {
      const saleRecords = []; // To store new sales records
  
      // Log sales data
      console.log("Sales Data Received:", sales);
  
      for (const sale of sales) {
        const { productName, quantity } = sale;
  
        // Check if the product exists in inventory
        const product = await Inventory.findOne({ productName });
        if (!product) {
          return res.status(404).json({ message: `Product ${productName} not found in inventory` });
        }
  
        if (product.quantity < quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${productName}` });
        }
  
        // Log the product and quantity being processed
        console.log(`Processing product: ${productName}, Quantity: ${quantity}`);
  
        // Prepare sale record
        const totalPrice = quantity * productPrices[productName];
        saleRecords.push({ productName, quantity, totalPrice });
      }
  
      // Save all sales records
      const newSales = await Sale.insertMany(saleRecords);
  
      res.status(201).json({ message: 'Sales successfully processed', sales: newSales });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
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
          total: product.quantity - soldQuantity, // Remaining stock for dashboard
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
