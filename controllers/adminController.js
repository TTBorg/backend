const Admin = require('../models/adminModel');  
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklist = new Set();
const { blacklistToken } = require('../middleware/authMiddleware');
const ProjectManager = require('../models/pmModel');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Admin Signup
exports.registerAdmin = async (req, res) => {
  try {
    const { 
      fname, 
      lname, 
      company_name, 
      email, 
      alt_email, 
      phone, 
      address, 
      country, 
      state, 
      team_size, 
      password 
    } = req.body;

    // Simple validation for required fields
    if (!email || !password || !fname || !lname || !company_name) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if email is already in use
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ error: 'Email is already in use' });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new admin
    const newAdmin = new Admin({
      fname,
      lname,
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

    // Exclude the password from the returned details
    const { password: _, ...adminDetails } = newAdmin.toObject();

    // Return success response with user details
    res.status(201).json({
      message: 'Admin registered successfully',
      user: adminDetails, // Return admin details
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register admin' });
  }
};


// Admin Login
// exports.loginAdmin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Simple validation for email and password
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Please provide both email and password' });
//     }

//     // Find the admin by email
//     const admin = await Admin.findOne({ email });
//     if (!admin) return res.status(401).json({ error: 'Admin not found' });

//     // Check if the provided password matches the stored hashed password
//     const isPasswordValid = await bcrypt.compare(password, admin.password);
//     if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

//     // Generate a JWT token (using the JWT_SECRET from the .env file)
//     const token = jwt.sign(
//       { id: admin._id, role: admin.role }, 
//       process.env.JWT_SECRET,              
//       { expiresIn: '1h' }                 
//     );

//     // Return the token to the client
//     res.status(200).json({
//       message: 'Login successful',
//       token, // The JWT token to be used in subsequent requests
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Login failed' });
//   }
// };

// exports.loginAdmin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Simple validation for email and password
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Please provide both email and password' });
//     }

//     // Find the admin by email
//     const admin = await Admin.findOne({ email });
//     if (!admin) return res.status(401).json({ error: 'Admin not found' });

//     // Check if the provided password matches the stored hashed password
//     const isPasswordValid = await bcrypt.compare(password, admin.password);
//     if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

//     // Generate a JWT token (using the JWT_SECRET from the .env file)
//     const token = jwt.sign(
//       { id: admin._id, role: admin.role }, 
//       process.env.JWT_SECRET,              
//       { expiresIn: '1h' }                 
//     );

//     // Return the token and admin details to the client
//     res.status(200).json({
//       message: 'Login successful',
//       token, // The JWT token to be used in subsequent requests
//       user: {
//         id: admin._id,
//         first_name: admin.first_name,
//         last_name: admin.last_name,
//         company_name: admin.company_name,
//         email: admin.email,
//         alt_email: admin.alt_email,
//         phone: admin.phone,
//         address: admin.address,
//         country: admin.ecountrymail,
//         state: admin.state,
//         team_size: admin.team_size,
//         role: admin.role,
//         // Add any other fields from the admin document you'd like to include
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Login failed' });
//   }
// };

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Define models to check against
    const models = [
      { model: Admin, role: 'admin' },
      { model: ProjectManager, role: 'project_manager' },
      // Add other roles and models here as needed
    ];

    let user = null;
    let userRole = null;

    // Check each model for the email
    for (const { model, role } of models) {
      user = await model.findOne({ email });
      if (user) {
        userRole = role;
        break; // Stop searching once a match is found
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token (using the JWT_SECRET from the .env file)
    const token = jwt.sign(
      { id: user._id, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Prepare user details for response
    const userDetails = {
      _id: user._id, // Keep it as _id
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      role: userRole,
      // Include role-specific fields
      ...(userRole === 'admin' && {
        company_name: user.company_name,
        alt_email: user.alt_email,
        phone: user.phone,
        address: user.address,
        country: user.country,
        state: user.state,
        team_size: user.team_size,
      }),
      ...(userRole === 'project_manager' && {
        projects: user.projects, // Example of PM-specific field
      }),
    };
    

    // Return the token and user details to the client
    res.status(200).json({
      message: 'Login successful',
      token,
      user: userDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};


// // Invite a PM
// exports.invitePM = async (req, res) => {
//   const { email } = req.body;

//   try {
//     if (!email) {
//       return res.status(400).json({ error: 'Email is required' });
//     }

//     // Check if PM already exists
//     const existingPM = await ProjectManager.findOne({ email });
//     if (existingPM) {
//       return res.status(400).json({ error: 'Project Manager already exists' });
//     }

//     // Generate a unique signup token
//     const signupToken = crypto.randomBytes(32).toString('hex');

//     // Send signup email
//     const signupLink = `${process.env.FRONTEND_URL}/signup?token=${signupToken}`;
//     await sendEmail(
//       email,
//       'Project Manager Invitation',
//       `<p>You have been invited to join as a Project Manager. Click <a href="${signupLink}">here</a> to sign up.</p>`
//     );

//     res.status(200).json({ message: 'Invitation sent successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to invite Project Manager' });
//   }
// };


// exports.invitePM = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Step 1: Validate the email field exists
//     if (!email) {
//       return res.status(400).json({ error: 'Email is required' });
//     }

//     // Step 2: Validate the email format
//     const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//     if (!isValidEmail) {
//       return res.status(400).json({ error: 'Invalid email address' });
//     }

//     // Step 3: Check if the Project Manager already exists
//     try {
//       const existingPM = await ProjectManager.findOne({ email });
//       if (existingPM) {
//         return res.status(400).json({ error: 'Project Manager already exists' });
//       }
//     } catch (dbError) {
//       console.error('Error querying the database:', dbError);
//       return res.status(500).json({ error: 'Database query failed while checking for existing Project Manager' });
//     }

//     // Step 4: Generate a unique signup token
//     let signupToken;
//     try {
//       signupToken = crypto.randomBytes(32).toString('hex');
//     } catch (tokenError) {
//       console.error('Error generating signup token:', tokenError);
//       return res.status(500).json({ error: 'Failed to generate signup token' });
//     }

//     // Step 5: Hash the token and store it with an expiration time
//     const hashedToken = crypto.createHash('sha256').update(signupToken).digest('hex');
//     const tokenExpiration = Date.now() + 24 * 60 * 60 * 1000; // Token valid for 24 hours

//     try {
//       await ProjectManager.create({
//         email,
//         signupToken: hashedToken,
//         signupTokenExpires: tokenExpiration,
//       });
//     } catch (saveError) {
//       console.error('Error saving Project Manager to the database:', saveError);
//       return res.status(500).json({ error: 'Failed to save Project Manager to the database' });
//     }

//     // Step 6: Create the signup link
//     const signupLink = `${process.env.FRONTEND_URL}/signup?token=${signupToken}`;

//     // Step 7: Send the email
//     try {
//       const emailContent = `
//         <p>You have been invited to join as a Project Manager.</p>
//         <p>Click <a href="${signupLink}">here</a> to sign up.</p>
//         <p>This link will expire in 24 hours.</p>
//       `;
//       await sendEmail(email, 'Project Manager Invitation', emailContent);
//     } catch (emailError) {
//       console.error('Error sending invitation email:', emailError);
//       return res.status(500).json({ error: 'Failed to send invitation email' });
//     }

//     // Success Response
//     res.status(200).json({
//       message: 'Invitation sent successfully',
//       signupLink, // For debugging, remove in production
//     });
//   } catch (error) {
//     console.error('Unexpected error in invitePM:', error);
//     res.status(500).json({ error: 'An unexpected error occurred' });
//   }
// };

// exports.invitePM = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Step 1: Validate the email field exists
//     if (!email) {
//       return res.status(400).json({ error: 'Email is required' });
//     }

//     // Step 2: Validate the email format
//     const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//     if (!isValidEmail) {
//       return res.status(400).json({ error: 'Invalid email address' });
//     }

//     // Step 3: Check if the Project Manager already exists
//     try {
//       const existingPM = await ProjectManager.findOne({ email });
//       // if (existingPM) {
//       //   return res.status(400).json({ error: 'Project Manager already exists' });
//       // }
//     } catch (dbError) {
//       console.error('Error querying the database:', dbError);
//       return res.status(500).json({ error: 'Database query failed while checking for existing Project Manager' });
//     }

//     // Step 4: Generate a unique signup token
//     let signupToken;
//     try {
//       signupToken = `pm_${crypto.randomBytes(32).toString('hex')}`;
//     } catch (tokenError) {
//       console.error('Error generating signup token:', tokenError);
//       return res.status(500).json({ error: 'Failed to generate signup token' });
//     }

//     // Step 5: Hash the token and store it with an expiration time
//     const hashedToken = crypto.createHash('sha256').update(signupToken.replace('pm_', '')).digest('hex');
//     const tokenExpiration = Date.now() + 24 * 60 * 60 * 1000; // Token valid for 24 hours

//     try {
//       await ProjectManager.create({
//         email,
//         signupToken: hashedToken,
//         signupTokenExpires: tokenExpiration,
//       });
//     } catch (saveError) {
//       console.error('Error saving Project Manager to the database:', saveError);
//       return res.status(500).json({ error: 'Failed to save Project Manager to the database' });
//     }

//     // Step 6: Create the signup link
//     const signupLink = `${process.env.FRONTEND_URL}/signup?token=${signupToken}`;

//     // Step 7: Send the email
//     try {
//       const emailContent = `
//         <p>You have been invited to join as a Project Manager.</p>
//         <p>Click <a href="${signupLink}">here</a> to sign up.</p>
//         <p>This link will expire in 24 hours.</p>
//       `;
//       await sendEmail(email, 'Project Manager Invitation', emailContent);
//     } catch (emailError) {
//       console.error('Error sending invitation email:', emailError);
//       return res.status(500).json({ error: 'Failed to send invitation email', details: emailError.message });
//     }

//     // Success Response
//     res.status(200).json({
//       message: 'Invitation sent successfully',
//     });
//   } catch (error) {
//     console.error('Unexpected error in invitePM:', error);
//     res.status(500).json({ error: 'An unexpected error occurred' });
//   }
// };


exports.invitePM = async (req, res) => {
  const { email, admin_id } = req.body;

  try {
    // Step 1: Validate required fields
    if (!email || !admin_id) {
      return res.status(400).json({ error: 'Email and admin ID are required' });
    }

    // Step 2: Validate the email format
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Step 3: Validate admin_id as an ObjectId
    if (!mongoose.isValidObjectId(admin_id)) {
      return res.status(400).json({ error: 'Invalid admin ID' });
    }

    // Step 4: Check if the admin exists
    const admin = await Admin.findById(admin_id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Step 5: Create the signup link with the admin_id
    const signupLink = `https://ttb-project.vercel.app/pm-profile-setup?admin_id=${admin_id}`;

    // Step 6: Send the invitation email
    try {
      const emailContent = `
        <p>You have been invited to join as a Project Manager by ${admin.fname} ${admin.lname}.</p>
        <p>Click <a href="${signupLink}">here</a> to sign up.</p>
        <p>If you did not request this invitation, please ignore this email.</p>
      `;
      await sendEmail(email, 'Invitation to Join as Project Manager', emailContent);
    } catch (emailError) {
      console.error('Error sending invitation email:', emailError);
      return res.status(500).json({ error: 'Failed to send invitation email', signupLink, details: emailError.message });
    }

    // Success Response
    res.status(200).json({
      message: 'Invitation sent successfully',
      signupLink, 
    });
  } catch (error) {
    console.error('Unexpected error in invitePM:', error);
    res.status(500).json({ error: 'An unexpected error occurred',
      signupLink,
     });
  }
};


exports.getAllAdmins = async (req, res) => {
  try {
    // Retrieve all admins from the database
    const admins = await Admin.find();

    if (admins.length === 0) {
      return res.status(404).json({ message: 'No admins found' });
    }

    // Return the list of admins
    res.status(200).json({
      message: 'Admins retrieved successfully',
      admins, // This will send the list of all admins
    });
  } catch (error) {
    console.error('Error retrieving admins:', error);
    res.status(500).json({ error: 'Failed to retrieve admins' });
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
  
