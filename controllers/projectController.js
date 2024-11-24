const mongoose = require('mongoose');  // <-- Ensure this line is included
const Project = require('../models/projectModel');
const ProjectManager = require('../models/pmModel');
const Admin = require('../models/adminModel');

// exports.createProject = async (req, res) => {
//     const { title, client_name, compliance_info, created_by, pm_id, status } = req.body;
  
//     try {
//       // Validate `created_by` and `pm_id` as ObjectIds
//       if (!mongoose.isValidObjectId(created_by)) {
//         return res.status(400).json({ error: 'Invalid created_by ID' });
//       }
//       if (!mongoose.isValidObjectId(pm_id)) {
//         return res.status(400).json({ error: 'Invalid pm_id' });
//       }
  
//       // Verify the admin creating the project
//       const adminUser = await Admin.findById(created_by);
//       console.log("adminUser:", adminUser); // Debugging step
//       if (!adminUser || adminUser.role !== 'Admin') {
//         return res.status(403).json({ error: 'Only admins can create projects' });
//       }
  
//       // Verify the project manager
//     //   const projectManagers = await ProjectManager.find();

//       const projectManager = await ProjectManager.findById(pm_id);
//     //   console.log("projectManager:", projectManager); // Debugging step
//       if (!projectManager) {
//         return res.status(400).json({ error: 'Invalid project manager ID' });
//       }
//       if (projectManager.role !== 'Project Manager') {
//         return res.status(400).json({ error: 'Invalid project manager Role' });
//       }  
//       // Create the project
//       const newProject = new Project({
//         title,
//         client_name,
//         compliance_info,
//         created_by,
//         pm_id,
//         status,
//       });
  
//       const savedProject = await newProject.save();
//       res.status(201).json({
//         message: 'Project created successfully',
//         project: savedProject,
//       });
//     } catch (error) {
//       console.error('Error creating project:', error);
//       res.status(500).json({ error: 'Failed to create project' });
//     }
//   };

exports.createProject = async (req, res) => {
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
      const adminUser = await Admin.findById(created_by);
    // console.log("adminUser:", adminUser);  // Debugging step
      if (!adminUser || adminUser.role !== 'Admin') {
        return res.status(403).json({ error: 'Only admins can create projects' });
      }
  
      // Verify the project manager
      const projectManager = await ProjectManager.findById(pm_id);
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
  
exports.updateProject = async (req, res) => {
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
      project.updated_at = Date.now();
  
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
  
  