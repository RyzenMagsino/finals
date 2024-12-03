require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const loginRoutes = require('./routes/login');
const inventoryRouter = require('./routes/inventory');
const salesRouter = require('./routes/sales');
const posRouter = require('./routes/pos');

const app = express();

// Middleware
app.use(cors());
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

// Use sales routes
app.use('/api/sales', salesRouter);

// Use POS routes
app.use('/api/pos', posRouter);


// Use inventory routes
app.use('/api/inventory', inventoryRouter);

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
