const ProjectManager = require('../models/pmModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Don't forget to import jwt

// PM Signup
exports.signupPM = async (req, res) => {
  const { fname, lname, email, password } = req.body;  // Use fname and lname as in the model

  try {
    // Validate required fields
    if (!fname || !lname || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if PM already exists
    const existingPM = await ProjectManager.findOne({ email });
    if (existingPM) {
      return res.status(400).json({ error: 'Account already exists. Please log in.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new PM
    const newPM = new ProjectManager({
      fname,
      lname,
      email,
      password: hashedPassword,
    });
    await newPM.save();

    res.status(201).json({
      message: 'Project Manager Registered Successfully',
      user: newPM, // Return PM details
    });  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Signup failed' });
  }
};

// PM Login
exports.loginPM = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Check if the Project Manager exists
    const pm = await ProjectManager.findOne({ email });
    if (!pm) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, pm.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { pmId: pm._id, email: pm.email, role: pm.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Adjust expiration as needed
    );

    // Return success response with the token
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: pm._id,
        fname: pm.fname,
        lname: pm.lname,
        email: pm.email,
        role: pm.role,
        // Add any other fields from the admin document you'd like to include
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};
