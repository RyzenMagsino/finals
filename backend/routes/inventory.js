// routes/inventory.js
const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventoryModel');

// Route to get all products
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find(); // Fetch all inventory
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add a new product
router.post('/', async (req, res) => {
    const { productName, quantity } = req.body;
  
    try {
      // Get the last inserted item
      const lastItem = await Inventory.findOne().sort({ id: -1 });
      const newId = lastItem ? lastItem.id + 1 : 1; // Increment or start at 1
  
      const newProduct = new Inventory({
        id: newId,
        productName,
        quantity,
      });
  
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct); // Respond with the saved product
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// Route to delete a product
router.delete('/:id', async (req, res) => {
    try {
      const deletedProduct = await Inventory.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;
