const express = require('express');
const Product = require('../models/Product');
const Sale = require('../models/Sale');

const router = express.Router();


// Fetch all products
router.get('/', async (req, res) => {
    try {
      const products = await Product.find(); // Fetch all products from the database
      res.json({ products });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch products', message: err.message });
    }
  });
  

// Update the product quantity
router.patch('/:id/update', async (req, res) => {
    console.log(`Updating product ${req.params.id} with quantity: ${req.body.qty}`);
    const { id } = req.params;
    const { qty } = req.body;
  
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      product.qty = qty;  // Update the quantity
      await product.save();  // Save changes to the database
      res.json({ message: 'Product quantity updated', product });
    } catch (err) {
      res.status(400).json({ error: 'Failed to update product', message: err.message });
    }
  });
  
// Save the sale transaction
router.post('/sales', async (req, res) => {
    const { totalAmount, paymentAmount, changeAmount, products } = req.body;
  
    try {
      // Validate stock for each product
      for (const product of products) {
        const prod = await Product.findById(product.productId); // Find the product in the database
  
        if (prod.qty < product.qty) {
          throw new Error(`Insufficient stock for ${prod.name}. Available: ${prod.qty}, Requested: ${product.qty}`);
        }
      }
  
      // If all validations pass, record the sale
      const sale = new Sale({
        totalAmount,
        paymentAmount,
        changeAmount,
        products,
        date: new Date(),
      });
  
      await sale.save();
  
      // Update the quantities of the products
      for (const product of products) {
        const prod = await Product.findById(product.productId);
        prod.qty -= product.qty; // Decrease the stock
        await prod.save();
      }
  
      res.status(201).json({ message: 'Sale recorded successfully', sale });
    } catch (err) {
      console.error('Error processing sale:', err.message);
      res.status(400).json({ error: 'Failed to process sale', message: err.message });
    }
  });
  
  


// API route to add a new product
router.post('/add-product', async (req, res) => {
    const { name, price, qty } = req.body;

    if (!name || !price || !qty) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Create a new product in the database
        const newProduct = new Product({ name, price, qty });
        await newProduct.save();

        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
});

module.exports = router;