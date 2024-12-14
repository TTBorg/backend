import mongoose from 'mongoose';
import Project from '../models/projectModel';
import { ProjectManager } from '../models/pmModel';
import { Admin } from '../models/adminModel';
import { Request, Response } from 'express';

export const createProject = async (req: Request, res: Response) => {
  const { title, client_name, compliance_info, created_by, pm_id, status } = req.body;

  try {
    // Validate `created_by` and `pm_id` as ObjectIds
    if (!mongoose.isValidObjectId(created_by)) {
      return res.status(400).json({ error: 'Invalid created_by ID' });
    }
    if (!mongoose.isValidObjectId(pm_id)) {
      return res.status(400).json({ error: 'Invalid pm_id' });
    }

    // Verify the admin creating the project
    const adminUser: any = await Admin.findById(created_by);
    // console.log("adminUser:", adminUser);  // Debugging step
    if (!adminUser || adminUser.role !== "Admin") {
      return res.status(403).json({ error: 'Only admins can create projects' });
    }

    // Verify the project manager
    const projectManager: any = await ProjectManager.findById(pm_id);
    //   console.log("projectManager:", projectManager);  // Debugging step
    if (!projectManager) {
      return res.status(400).json({ error: 'Invalid project manager ID' });
    }
    if (projectManager.role !== 'Project Manager') {
      return res.status(400).json({ error: 'Invalid project manager Role' });
    }

    // Create the project
    const newProject = new Project({
      title,
      client_name,
      compliance_info,
      created_by,
      pm_id,
      status,
    });

    const savedProject = await newProject.save();
    res.status(201).json({
      message: 'Project created successfully',
      project: savedProject,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { title, client_name, compliance_info, status } = req.body;

  try {
    // Check if the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update project fields
    project.title = title || project.title;
    project.client_name = client_name || project.client_name;
    project.compliance_info = compliance_info || project.compliance_info;
    project.status = status || project.status;
    project.updated_at = Date.now().toString();

    // Save the updated project
    const updatedProject = await project.save();
    res.status(200).json({
      message: 'Project updated successfully',
      project: updatedProject,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const getProjectsByAdminId = async (req: Request, res: Response) => {
  const { admin_id } = req.params; // Assuming the admin ID is passed as a URL parameter

  try {
    // Validate the admin_id as an ObjectId
    if (!mongoose.isValidObjectId(admin_id)) {
      return res.status(400).json({ error: 'Invalid admin_id' });
    }

    // Check if the admin exists
    const admin = await Admin.findById(admin_id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Fetch projects created by this admin
    const projects = await Project.find({ created_by: admin_id });

    // Respond with the projects
    res.status(200).json({
      message: 'Projects fetched successfully',
      projects,
    });
  } catch (error) {
    console.error('Error fetching projects by admin_id:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};


export const getProjectById = async (req: Request, res: Response) => {
  const { project_id } = req.params; // Assuming the project ID is passed as a URL parameter

  try {
    // Validate the project_id as an ObjectId
    // if (!mongoose.isValidObjectId(project_id)) {
    //   return res.status(400).json({ error: 'Invalid project_id' });
    // }

    // Fetch the project by its ID
    const project = await Project.findById(project_id);

    // Check if the project exists
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Respond with the project details
    res.status(200).json({
      message: 'Project fetched successfully',
      project,
    });
  } catch (error) {
    console.error('Error fetching project by project_id:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};
