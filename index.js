const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes'); 
const pmRoutes = require('./routes/pmRoutes'); 
const projectRoutes = require('./routes/projectRoutes'); 

dotenv.config();

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


app.use(bodyParser.json()); // For parsing application/json

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error: ', err));

// Use the admin routes
app.use('/api/admin', adminRoutes);
app.use('/api/pm', pmRoutes);
app.use('/api/projects', projectRoutes);


// Basic Test Route (You can test this by visiting http://localhost:3000/)
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});