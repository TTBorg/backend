const ProjectManager = require('../models/pmModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const mongoose = require('mongoose');  
const Admin = require('../models/adminModel');
// http://localhost:3000/api/pm/project-managers/admin/673b0b7422966c929aa1d7ac

// PM Signup
// exports.signupPM = async (req, res) => {
//   const { fname, lname, email, password, admin_id } = req.body;  // Use fname and lname as in the model

//   try {
//     // Validate required fields
//     if (!fname || !lname || !email || !admin_id || !password) {
//       return res.status(400).json({ error: 'Please provide all required fields' });
//     }

//     // Check if PM already exists
//     const existingPM = await ProjectManager.findOne({ email });
//     if (existingPM) {
//       return res.status(400).json({ error: 'Account already exists. Please log in.' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create and save new PM
//     const newPM = new ProjectManager({
//       fname,
//       lname,
//       email,
//       admin_id,
//       password: hashedPassword,
//     });
//     await newPM.save();

//     res.status(201).json({
//       message: 'Project Manager Registered Successfully',
//       user: newPM, // Return PM details
//     });  
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Signup failed' });
//   }
// };

// PM Signup
exports.signupPM = async (req, res) => {
  const { fname, lname, email, password, admin_id } = req.body;

  try {
    // Validate required fields
    if (!fname || !lname || !email || !password || !admin_id) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Validate admin_id
    if (!mongoose.isValidObjectId(admin_id)) {
      return res.status(400).json({ error: 'Invalid admin ID' });
    }

    // Check if the admin exists
    const admin = await Admin.findById(admin_id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
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
      admin_id,
      password: hashedPassword,
    });
    await newPM.save();

    res.status(201).json({
      message: 'Project Manager Registered Successfully',
      user: newPM,
    });
  } catch (error) {
    console.error('Error signing up project manager:', error);
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
        admin_id: pm.admin_id,
        role: pm.admin_id,
        // Add any other fields from the admin document you'd like to include
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getAllProjectManagers = async (req, res) => {
  try {
    // Retrieve all project managers
    const projectManagers = await ProjectManager.find();

    if (projectManagers.length === 0) {
      return res.status(404).json({ message: 'No project managers found' });
    }

    // Return the list of project managers
    res.status(200).json({
      message: 'Project managers retrieved successfully',
      projectManagers,
    });
  } catch (error) {
    console.error('Error retrieving project managers:', error);
    res.status(500).json({ error: 'Failed to retrieve project managers' });
  }
};

exports.getProjectManagersByAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    // Validate the adminId
    if (!mongoose.isValidObjectId(adminId)) {
      return res.status(400).json({ error: 'Invalid admin ID' });
    }

    // Check if the admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Retrieve project managers associated with the admin ID
    const projectManagers = await ProjectManager.find({ admin_id: adminId });

    if (projectManagers.length === 0) {
      return res.status(200).json({ message: 'No project managers found for this admin' });
    }

    // Return the list of project managers
    res.status(200).json({
      message: 'Project managers retrieved successfully',
      projectManagers,
    });
  } catch (error) {
    console.error('Error retrieving project managers:', error);
    res.status(500).json({ error: 'Failed to retrieve project managers' });
  }
};

