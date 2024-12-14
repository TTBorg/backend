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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
require('dotenv').config(); // Load environment variables from the .env file
// Create a Nodemailer transporter for Gmail
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail', // This tells Nodemailer to use Gmail's SMTP service
    auth: {
        user: process.env.MAIL_USERNAME, // Your Gmail address
        pass: process.env.MAIL_PASSWORD, // Your app-specific password
    },
});
// Function to send email
const sendEmail = (to, subject, text, html) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`, // Sender address
        to, // Recipient's email
        subject, // Subject line
        text, // Plain text body
        html, // HTML body (optional)
    };
    try {
        // Send the email
        const info = yield transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
});
exports.default = sendEmail;
