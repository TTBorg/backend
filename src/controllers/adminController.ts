import { Admin } from '../models/adminModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { blacklistToken } from '../middleware/authMiddleware';
import { ProjectManager } from '../models/pmModel';
import sendEmail from '../utils/sendEmail';
import mongoose from 'mongoose';
import { Request, RequestHandler, Response } from 'express';
import { UserRole } from '../types/user';
import Token from '../models/tokenModel';
import Project from '../models/projectModel';

// Admin Signup
export const registerAdmin: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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

    // Check if email is already in use
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) res.status(400).json({ error: 'Email is already in use' });

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

    let token = new Token({
      userId: adminDetails._id,
      token: crypto.randomBytes(32).toString("hex")
    }).save();

    try {
      const emailContent = `
        <p>Congratulations, your signup was successful</p>
        <p>Click <a href="${process.env.APP_URL}/verify-email?token=${(await token).token}">here</a> to verify your mail.</p>
        <p>If you did not request this invitation, please ignore this email.</p>
      `;
      await sendEmail(email, 'Welcome to TTB', emailContent);
    } catch (emailError: any) {
      console.error('Error sending invitation email:', emailError);
      res.status(500).json({ error: 'Failed to send invitation email', token: (await token).token, details: emailError.message });
    }

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


//verify email
export const verifyEmail: RequestHandler = async (req: Request, res: Response) => {
  try {

    const { token } = req.body;
    console.log(token);

    const tokenValid = await Token.findOne({ token }).exec();
    if (!tokenValid) {
      throw new Error('Invalid or expired token');
    }

    const user = await Admin.findById(tokenValid.userId);
    if (!user) {
      res.status(400).json({ error: 'User not found' });
    }
    else {
      user.verified_mail = true;
      user.save();
      await Token.deleteOne({ token });
      res.status(200).json({
        message: 'Verification successful',
        token,
        user: user,
      });
    }


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Verification failed' });
  }

}


// Admin Login
export const loginAdmin: RequestHandler = async (req: Request, res: Response) => {
  const { email, password }: { email: string, password: string } = req.body;
  console.log(email);

  try {
    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ error: 'Please provide email and password' });
    }

    // Define models to check against
    const models = [
      Admin, ProjectManager
      // Add other roles and models here as needed
    ];

    let user: any;
    let userRole: UserRole | undefined = undefined;

    // Check each model for the email
    for (const model of models) {
      console.log(model, 'ldld')
      user = await model.findOne({ email }).exec();
      if (user) {
        userRole = user.role;
        break; // Stop searching once a match is found
      }
    }

    if (!user) {
      res.status(401).json({ error: 'User not found' });
    }
    // Check if the provided password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token (using the JWT_SECRET from the .env file)

    const secret = process.env.JWT_SECRET || '';
    const token = jwt.sign(
      { id: user._id, role: userRole, verified: user.verified_mail },
      secret,
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
        projects: user.assigned_projects, // Example of PM-specific field
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

// Invite Project Manager
export const invitePM: RequestHandler = async (req: Request, res: Response) => {
  const { email, admin_id } = req.body;

  try {
    // Step 1: Validate required fields


    // Step 2: Validate the email format
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      throw new Error('Invalid email format');
    }

    // Step 3: Validate admin_id as an ObjectId
    if (!mongoose.isValidObjectId(admin_id)) {
      throw new Error('Invalid admin ID');
    }

    // Step 4: Check if the admin exists
    const admin = await Admin.findById(admin_id);
    if (!admin) {
      throw new Error('Admin not found');
    }

    // Step 5: Create the signup link with the admin_id
    const signupLink = `${process.env.APP_URL}/pm-profile-setup?admin_id=${admin_id}`;

    // Step 6: Send the invitation emailRequestHandler
    try {
      const emailContent = `
        <p>You have been invited to join as a Project Manager by ${admin.fname} ${admin.lname}.</p>
        <p>Click <a href="${signupLink}">here</a> to sign up.</p>
        <p>If you did not request this invitation, please ignore this email.</p>
      `;
      await sendEmail(email, 'Invitation to Join as Project Manager', emailContent);
    } catch (emailError: any) {
      console.error('Error sending invitation email:', emailError);
      throw new Error('Failed to send invitation email');
    }

    // Success Response
    res.status(200).json({
      message: 'Invitation sent successfully',
      signupLink,
    });
  } catch (error) {
    console.error('Unexpected error in invitePM:', error);
    res.status(500).json({
      error: 'An unexpected error occurred',
    });
  }
};

// Get all Admins
export const getAllAdmins: RequestHandler = async (req: Request, res: Response) => {
  try {
    // Retrieve all admins from the database
    const admins = await Admin.find();

    if (admins.length === 0) {
      throw new Error('No admins found');
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


// Logout
export const logoutAdmin: RequestHandler = (req: Request, res: Response) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    res.status(400).json({ message: 'Token is required for logout' });
  } else {
    blacklistToken(token);
    res.status(200).json({ message: 'Logout successful' });
  }

};

// Create Project
export const createProject = async (req: Request, res: Response) => {
  const { title, created_by, pm_id } = req.body;

  try {
    // Validate `created_by` and `pm_id` as ObjectIds
    if (!mongoose.isValidObjectId(created_by)) {
      return res.status(400).json({ error: 'Invalid created_by ID' });
    }
    if (!mongoose.isValidObjectId(pm_id)) {
      return res.status(400).json({ error: 'Invalid pm_id' });
    }
    console.log('got here 1');
    // Verify the admin creating the project
    const adminUser: any = await Admin.findById(created_by);
    // console.log("adminUser:", adminUser);  // Debugging step
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ error: 'Only admins can create projects' });
    }

    console.log('got here 2');

    // Verify the project manager
    const projectManager: any = await ProjectManager.findById(pm_id);
    //   console.log("projectManager:", projectManager);  // Debugging step
    if (!projectManager) {
      return res.status(400).json({ error: 'Invalid project manager ID' });
    }
    if (projectManager.role !== 'project_manager') {
      return res.status(400).json({ error: 'Invalid project manager Role' });
    }

    console.log('got here 3');

    // Create the project
    const newProject = new Project({
      title,
      created_by,
      pm_id,
      status: 'active'
    });
    projectManager.assigned_projects.push(newProject._id);
    await projectManager.save();

    const savedProject = await newProject.save();
    res.status(201).json({
      message: 'Project created successfully',
      project: savedProject,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project', error });
  }
};

export const reassignProjectController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { pm_id } = req.body;
  try {

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    if (!mongoose.isValidObjectId(pm_id)) {
      return res.status(400).json({ error: 'Invalid pm_id' });
    }

    const project = await Project.findById(id);
    if (!project) return res.status(400).json({ error: 'Project not found' });

    project.pm_id = pm_id;
    await project.save();

    res.status(200).json({
      message: 'Project reassigned successfully',
      project: project,
    });

  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to reassign project' });
  }

}

export const getAllProjectManagers = async (req: Request, res: Response) => {
  try {
    // Retrieve all project managers
    const projectManagers = await ProjectManager.find().populate('assigned_projects').exec();

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

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    // Retrieve all project managers
    const projects = await Project.find();

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No project found' });
    }

    // Return the list of project managers
    res.status(200).json({
      message: 'Projects retrieved successfully',
      projects,
    });
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
};


