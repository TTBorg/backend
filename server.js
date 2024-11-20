const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const adminRoutes = require('./routes/adminRoutes'); 
const pmRoutes = require('./routes/pmRoutes'); 

const app = express();
app.use(express.json());  

// Connect to MongoDB
connectDB();

// Use the admin routes
app.use('/api/admin', adminRoutes);
app.use('/api/pm', pmRoutes);


app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

