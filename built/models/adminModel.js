"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
// import { UserRole } from "../types/user.d";
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["PROJECT_MANAGER"] = "project_manager";
    UserRole["CONTRACTOR"] = "contractor";
    UserRole["CONSULTANT"] = "consultant";
    UserRole["PROJECT_OWNER"] = "project_owner";
})(UserRole || (UserRole = {}));
// Define Admin schema
const adminSchema = new mongoose_1.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure that emails are unique in the database
    },
    alt_email: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    team_size: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: UserRole,
        default: UserRole.ADMIN
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    verified_mail: {
        type: Boolean,
        default: false
    }
});
exports.Admin = (0, mongoose_1.model)('Admin', adminSchema);
