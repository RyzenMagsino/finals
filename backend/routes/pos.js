const express = require('express');
const router = express.Router();
const Sale = require('../models/salesModel');
const Inventory = require('../models/inventoryModel');

// Add sales from POS
router.post('/payment', async (req, res) => {
    const { products } = req.body; // Expect an array of products [{ name, qty, price, totalPrice }]
    const salesToInsert = [];
    
    try {
        for (const product of products) {
            const { name: productName, qty: quantity, totalPrice } = product;

            // Check if product exists in inventory
            const inventoryItem = await Inventory.findOne({ productName });
            if (!inventoryItem) {
                return res.status(400).json({ message: `Product ${productName} not found in inventory` });
            }

            // Validate stock
            if (inventoryItem.quantity < quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${productName}` });
            }

            // Deduct inventory stock
            inventoryItem.quantity -= quantity;
            await inventoryItem.save();

            // Add sale to sales list
            salesToInsert.push({ productName, quantity, totalPrice });
        }

        // Insert all sales
        const sales = await Sale.insertMany(salesToInsert);
        res.status(201).json({ message: 'Sales added successfully', sales });
    } catch (err) {
        res.status(500).json({ message: 'Error processing sales', error: err.message });
    }
});

module.exports = router;
