"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProjects = exports.getAllProjectManagers = exports.reassignProjectController = exports.createProject = exports.logoutAdmin = exports.getAllAdmins = exports.invitePM = exports.loginAdmin = exports.verifyEmail = exports.registerAdmin = void 0;
const adminModel_1 = require("../models/adminModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const pmModel_1 = require("../models/pmModel");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const mongoose_1 = __importDefault(require("mongoose"));
const tokenModel_1 = __importDefault(require("../models/tokenModel"));
const projectModel_1 = __importDefault(require("../models/projectModel"));
// Admin Signup
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fname, lname, company_name, email, alt_email, phone, address, country, state, team_size, password } = req.body;
        // Check if email is already in use
        const existingAdmin = yield adminModel_1.Admin.findOne({ email });
        if (existingAdmin)
            res.status(400).json({ error: 'Email is already in use' });
        // Hash the password before saving
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create and save the new admin
        const newAdmin = new adminModel_1.Admin({
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
        yield newAdmin.save();
        // Exclude the password from the returned details
        const _a = newAdmin.toObject(), { password: _ } = _a, adminDetails = __rest(_a, ["password"]);
        let token = new tokenModel_1.default({
            userId: adminDetails._id,
            token: crypto_1.default.randomBytes(32).toString("hex")
        }).save();
        try {
            const emailContent = `
        <p>Congratulations, your signup was successful</p>
        <p>Click <a href="${process.env.APP_URL}/verify-email?token=${(yield token).token}">here</a> to verify your mail.</p>
        <p>If you did not request this invitation, please ignore this email.</p>
      `;
            yield (0, sendEmail_1.default)(email, 'Welcome to TTB', emailContent);
        }
        catch (emailError) {
            console.error('Error sending invitation email:', emailError);
            res.status(500).json({ error: 'Failed to send invitation email', token: (yield token).token, details: emailError.message });
        }
        // Return success response with user details
        res.status(201).json({
            message: 'Admin registered successfully',
            user: adminDetails, // Return admin details
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register admin' });
    }
});
exports.registerAdmin = registerAdmin;
//verify email
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        console.log(token);
        const tokenValid = yield tokenModel_1.default.findOne({ token }).exec();
        if (!tokenValid) {
            throw new Error('Invalid or expired token');
        }
        const user = yield adminModel_1.Admin.findById(tokenValid.userId);
        if (!user) {
            res.status(400).json({ error: 'User not found' });
        }
        else {
            user.verified_mail = true;
            user.save();
            yield tokenModel_1.default.deleteOne({ token });
            res.status(200).json({
                message: 'Verification successful',
                token,
                user: user,
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Verification failed' });
    }
});
exports.verifyEmail = verifyEmail;
// Admin Login
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email);
    try {
        // Validate required fields
        if (!email || !password) {
            res.status(400).json({ error: 'Please provide email and password' });
        }
        // Define models to check against
        const models = [
            adminModel_1.Admin, pmModel_1.ProjectManager
            // Add other roles and models here as needed
        ];
        let user;
        let userRole = undefined;
        // Check each model for the email
        for (const model of models) {
            console.log(model, 'ldld');
            user = yield model.findOne({ email }).exec();
            if (user) {
                userRole = user.role;
                break; // Stop searching once a match is found
            }
        }
        if (!user) {
            res.status(401).json({ error: 'User not found' });
        }
        // Check if the provided password matches the stored hashed password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate a JWT token (using the JWT_SECRET from the .env file)
        const secret = process.env.JWT_SECRET || '';
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: userRole, verified: user.verified_mail }, secret, { expiresIn: '1h' });
        // Prepare user details for response
        const userDetails = Object.assign(Object.assign({ _id: user._id, fname: user.fname, lname: user.lname, email: user.email, role: userRole }, (userRole === 'admin' && {
            company_name: user.company_name,
            alt_email: user.alt_email,
            phone: user.phone,
            address: user.address,
            country: user.country,
            state: user.state,
            team_size: user.team_size,
        })), (userRole === 'project_manager' && {
            projects: user.assigned_projects, // Example of PM-specific field
        }));
        // Return the token and user details to the client
        res.status(200).json({
            message: 'Login successful',
            token,
            user: userDetails,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});
exports.loginAdmin = loginAdmin;
// Invite Project Manager
const invitePM = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, admin_id } = req.body;
    try {
        // Step 1: Validate required fields
        // Step 2: Validate the email format
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValidEmail) {
            throw new Error('Invalid email format');
        }
        // Step 3: Validate admin_id as an ObjectId
        if (!mongoose_1.default.isValidObjectId(admin_id)) {
            throw new Error('Invalid admin ID');
        }
        // Step 4: Check if the admin exists
        const admin = yield adminModel_1.Admin.findById(admin_id);
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
            yield (0, sendEmail_1.default)(email, 'Invitation to Join as Project Manager', emailContent);
        }
        catch (emailError) {
            console.error('Error sending invitation email:', emailError);
            throw new Error('Failed to send invitation email');
        }
        // Success Response
        res.status(200).json({
            message: 'Invitation sent successfully',
            signupLink,
        });
    }
    catch (error) {
        console.error('Unexpected error in invitePM:', error);
        res.status(500).json({
            error: 'An unexpected error occurred',
        });
    }
});
exports.invitePM = invitePM;
// Get all Admins
const getAllAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve all admins from the database
        const admins = yield adminModel_1.Admin.find();
        if (admins.length === 0) {
            throw new Error('No admins found');
        }
        // Return the list of admins
        res.status(200).json({
            message: 'Admins retrieved successfully',
            admins, // This will send the list of all admins
        });
    }
    catch (error) {
        console.error('Error retrieving admins:', error);
        res.status(500).json({ error: 'Failed to retrieve admins' });
    }
});
exports.getAllAdmins = getAllAdmins;
// Logout
const logoutAdmin = (req, res) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(400).json({ message: 'Token is required for logout' });
    }
    else {
        (0, authMiddleware_1.blacklistToken)(token);
        res.status(200).json({ message: 'Logout successful' });
    }
};
exports.logoutAdmin = logoutAdmin;
// Create Project
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, created_by, pm_id } = req.body;
    try {
        // Validate `created_by` and `pm_id` as ObjectIds
        if (!mongoose_1.default.isValidObjectId(created_by)) {
            return res.status(400).json({ error: 'Invalid created_by ID' });
        }
        if (!mongoose_1.default.isValidObjectId(pm_id)) {
            return res.status(400).json({ error: 'Invalid pm_id' });
        }
        console.log('got here 1');
        // Verify the admin creating the project
        const adminUser = yield adminModel_1.Admin.findById(created_by);
        // console.log("adminUser:", adminUser);  // Debugging step
        if (!adminUser || adminUser.role !== "admin") {
            return res.status(403).json({ error: 'Only admins can create projects' });
        }
        console.log('got here 2');
        // Verify the project manager
        const projectManager = yield pmModel_1.ProjectManager.findById(pm_id);
        //   console.log("projectManager:", projectManager);  // Debugging step
        if (!projectManager) {
            return res.status(400).json({ error: 'Invalid project manager ID' });
        }
        if (projectManager.role !== 'project_manager') {
            return res.status(400).json({ error: 'Invalid project manager Role' });
        }
        console.log('got here 3');
        // Create the project
        const newProject = new projectModel_1.default({
            title,
            created_by,
            pm_id,
            status: 'active'
        });
        projectManager.assigned_projects.push(newProject._id);
        yield projectManager.save();
        const savedProject = yield newProject.save();
        res.status(201).json({
            message: 'Project created successfully',
            project: savedProject,
        });
    }
    catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Failed to create project', error });
    }
});
exports.createProject = createProject;
const reassignProjectController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { pm_id } = req.body;
    try {
        if (!mongoose_1.default.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid project ID' });
        }
        if (!mongoose_1.default.isValidObjectId(pm_id)) {
            return res.status(400).json({ error: 'Invalid pm_id' });
        }
        const project = yield projectModel_1.default.findById(id);
        if (!project)
            return res.status(400).json({ error: 'Project not found' });
        project.pm_id = pm_id;
        yield project.save();
        res.status(200).json({
            message: 'Project reassigned successfully',
            project: project,
        });
    }
    catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to reassign project' });
    }
});
exports.reassignProjectController = reassignProjectController;
const getAllProjectManagers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve all project managers
        const projectManagers = yield pmModel_1.ProjectManager.find().populate('assigned_projects').exec();
        if (projectManagers.length === 0) {
            return res.status(404).json({ message: 'No project managers found' });
        }
        // Return the list of project managers
        res.status(200).json({
            message: 'Project managers retrieved successfully',
            projectManagers,
        });
    }
    catch (error) {
        console.error('Error retrieving project managers:', error);
        res.status(500).json({ error: 'Failed to retrieve project managers' });
    }
});
exports.getAllProjectManagers = getAllProjectManagers;
const getAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve all project managers
        const projects = yield projectModel_1.default.find();
        if (projects.length === 0) {
            return res.status(404).json({ message: 'No project found' });
        }
        // Return the list of project managers
        res.status(200).json({
            message: 'Projects retrieved successfully',
            projects,
        });
    }
    catch (error) {
        console.error('Error retrieving projects:', error);
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
});
exports.getAllProjects = getAllProjects;
