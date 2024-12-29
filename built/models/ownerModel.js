"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Owner = void 0;
const mongoose_1 = require("mongoose");
const user_1 = require("../types/user");
// Define Admin schema
const ownerSchema = new mongoose_1.Schema({
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
        enum: user_1.UserRole,
        default: user_1.UserRole.ADMIN
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
exports.Owner = (0, mongoose_1.model)('Owner', ownerSchema);
