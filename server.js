const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const adminRoutes = require('./routes/adminRoutes'); 
const pmRoutes = require('./routes/pmRoutes'); 
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*', // Allow any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Optional, depends on your cookie/session setup
}));

// const allowedOrigins = ['https://your-production-site.com'];
// app.use(cors({
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));


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

