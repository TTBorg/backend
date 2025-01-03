import { ProjectManager } from '../models/pmModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Admin } from '../models/adminModel';
import { Request, Response } from 'express';
import ProjectDetail from '../models/projectDetailsModel';
import { CustomRequest } from '../middleware/authMiddleware';
import sendEmail from '../utils/sendEmail';


export const signupPM = async (req: Request, res: Response) => {
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
      verified_mail: true
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
export const loginPM = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Check if the Project Manager exists
    const pm: any = await ProjectManager.findOne({ email });
    if (!pm) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, pm?.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const secret = process.env.JWT_SECRET || '';

    const token = jwt.sign(
      { pmId: pm._id, email: pm.email, role: pm.role },
      secret,
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



export const getProjectManagersByAdmin = async (req: Request, res: Response) => {
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

export const createProjectDetails = async (req: Request, res: Response) => {
  const { project_description, project_id, compliance_documents, project_country, project_state, project_city, project_client } = req.body;

  try {


    // Check if the created_by ID is a valid ObjectId
    if (!mongoose.isValidObjectId(project_id)) {
      return res.status(400).json({ error: 'Project does not exist' });
    }

    const projectDetail = new ProjectDetail({
      project_id,
      project_description,
      compliance_documents,
      project_country,
      project_state,
      project_city,
      project_client,
    });
  } catch (error) {
    console.error('Error creating project details:', error);
    res.status(500).json({ error: 'Failed to create project details' });
  }


  // Check if the PM exists
}

export const sendInvites = async (req: Request, res: Response) => {

  // Send invites to contractors, owners, and consultants
  try {
    const { contractors, consultants, owners } = req.body;

    const customReq = req as CustomRequest;
    const pm = await ProjectManager.findById(customReq.token.pmId);
    if (!pm) {
      throw new Error('Project Manager not found');
    }
    const signupLink = (role: string) => `${process.env.APP_URL}/pm-invite-team?pm_id=${customReq.token.pmId}&role=${role}`;

    contractors.length > 0 && contractors.forEach(async (contractor: any) => {
      try {
        const emailContent = `
          <p>You have been invited to join as a contractor with role ${contractor.role} by ${pm.fname} ${pm.lname}.</p>
          <p>Click <a href="${signupLink(contractor.role)}">here</a> to sign up.</p>
          <p>If you did not request this invitation, please ignore this email.</p>
        `;
        await sendEmail(contractor.email, 'Invitation to Join as Contractor', emailContent);
      } catch (emailError: any) {
        console.error('Error sending invitation email:', emailError);
        throw new Error('Failed to send invitation email');
      }
    });

    consultants.length > 0 && consultants.forEach(async (consultant: any) => {
      try {
        const emailContent = `
          <p>You have been invited to join as a consultant with role ${consultant.role} by ${pm.fname} ${pm.lname}.</p>
          <p>Click <a href="${signupLink(consultant.role)}">here</a> to sign up.</p>
          <p>If you did not request this invitation, please ignore this email.</p>
        `;
        await sendEmail(consultant.email, 'Invitation to Join as Consultant', emailContent);
      } catch (emailError: any) {
        console.error('Error sending invitation email:', emailError);
        throw new Error('Failed to send invitation email');
      }
    });

    owners.length > 0 && owners.forEach(async (owner: any) => {
      try {
        const emailContent = `
          <p>You have been invited to join as an owner by ${pm.fname} ${pm.lname}.</p>
          <p>Click <a href="${signupLink('owner')}">here</a> to sign up.</p>
          <p>If you did not request this invitation, please ignore this email.</p>
        `;
        await sendEmail(owner.email, 'Invitation to Join as Project Owner', emailContent);
      } catch (emailError: any) {
        console.error('Error sending invitation email:', emailError);
        throw new Error('Failed to send invitation email');
      }
    })




    // Step 6: Send the invitation emailRequestHandler

    // Use nodemailer or any other email service to send invites
    // You can use the email address from the request body to send the invites
    // You can also use the project_id to get the project details and include them in the email
    // Return a success message if the invites are sent successfully
    // Return an error message if the invites fail to send
    res.status(200).json({ message: 'Invites sent successfully' });

  } catch (error) {
    console.error('Error sending invites:', error);
    res.status(500).json({ error: 'Failed to send invites' });

  }

};


