require('dotenv').config();
const adminRoutes = require('./routes/adminRoutes'); 
const pmRoutes = require('./routes/pmRoutes'); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
console.log(process.env.MONGO_URI);  // This should print the MongoDB URI to the console

// Middleware
app.use(cors());
app.use(bodyParser.json()); // For parsing application/json

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
};

// Connect to MongoDB
connectDB();

// Use the admin routes
app.use('/api/admin', adminRoutes);
app.use('/api/pm', pmRoutes);


// Basic Test Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

