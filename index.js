const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes'); // Import the admin routes

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // For parsing application/json

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error: ', err));

// Use the admin routes
app.use('/admin', adminRoutes);

// Basic Test Route (You can test this by visiting http://localhost:3000/)
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
