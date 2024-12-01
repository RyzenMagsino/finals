require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const loginRoutes = require('./routes/login');
const posRoutes = require('./routes/pos');
const inventoryRouter = require('./routes/inventory');

const app = express();

// Middleware
app.use(express.json());

// Log requests
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Serve static files (CSS, JS, HTML)
app.use(express.static(path.join(__dirname, '../Frontend')));

// Serve login.html on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'html', 'login.html'));
});

// Use inventory routes
app.use('/api/inventory', inventoryRouter);

// Use POS routes
app.use('/api/pos', posRoutes);

// API routes
app.use('/api/login', loginRoutes);

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error.message);
    });
