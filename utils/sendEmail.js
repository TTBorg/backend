// const nodemailer = require('nodemailer');

// const sendEmail = async (to, subject, htmlContent) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       html: htmlContent,
//     };

//     const result = await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully:', result);
//     return result;
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Failed to send email. Check logs for details.');
//   }
// };

// module.exports = sendEmail;

const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
  try {
    // Create transporter with the new SMTP configuration
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, 
      secure: process.env.EMAIL_ENCRYPTION === 'ssl', // Use secure connection if encryption is SSL
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      debug: true, // Enable debugging
      logger: true,
    });

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`, // Format sender info
      to,
      subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email. Check logs for details.');
  }
};

module.exports = sendEmail;
