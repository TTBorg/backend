const Admin = require('../models/adminModel');  
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklist = new Set();
const { blacklistToken } = require('../middleware/authMiddleware');


// Admin Signup
exports.registerAdmin = async (req, res) => {
  try {
    const { first_name, last_name, company_name, email, alt_email, phone, address, country, state, team_size, password } = req.body;

    // Simple validation for required fields
    if (!email || !password || !first_name || !last_name || !company_name) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if email is already in use
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ error: 'Email is already in use' });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new admin
    const newAdmin = new Admin({
      first_name,
      last_name,
      company_name,
      email,
      alt_email,
      phone,
      address,
      country,
      state,
      team_size,
      password: hashedPassword,
    });
    await newAdmin.save();

    // Return success response
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register admin' });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Simple validation for email and password
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password' });
    }

    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: 'Admin not found' });

    // Check if the provided password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate a JWT token (using the JWT_SECRET from the .env file)
    const token = jwt.sign(
      { id: admin._id, role: admin.role }, 
      process.env.JWT_SECRET,              
      { expiresIn: '1h' }                 
    );

    // Return the token to the client
    res.status(200).json({
      message: 'Login successful',
      token, // The JWT token to be used in subsequent requests
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};


exports.logoutAdmin = (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(400).json({ message: 'Token is required for logout' });
    }
    blacklistToken(token);
    res.status(200).json({ message: 'Logout successful' });
  };
  
