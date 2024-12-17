import nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';
require('dotenv').config(); // Load environment variables from the .env file

// Create a Nodemailer transporter for Gmail
// const transporter = nodemailer.createTransport({
//   service: 'gmail',  // This tells Nodemailer to use Gmail's SMTP service
//   auth: {
//     user: process.env.MAIL_USERNAME, // Your Gmail address
//     pass: process.env.MAIL_PASSWORD, // Your app-specific password
//   },
// });
const mailToken = process.env.MAIL_TOKEN || ''
const transporter = nodemailer.createTransport(
  {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b99bbe189610b5",
      pass: "bffc556788b4f8"
    }
  }
  // {
  //   host: process.env.MAIL_HOST,
  //   port: process.env.PORT,
  // }
);



// Function to send email
const sendEmail = async (to: string, subject?: string, text?: string, html?: string) => {
  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`, // Sender address
    to, // Recipient's email
    subject, // Subject line
    text, // Plain text body
    html, // HTML body (optional)
  };
  const sender = {
    address: "hello@example.com",
    name: "Mailtrap Tes",
  };
  const recipients = [
    to
  ];

  try {
    // Send the email
    const info = await transporter.sendMail({
      from: sender,
      to: recipients,
      subject: subject,
      html: text,

    });
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
