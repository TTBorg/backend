const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.titan.email',
    port: 465,
    secure: true,
    auth: {
      user: 'no-reply@etcvibes.com',
      pass: 'no-reply@etcvibes.com',
    },
    logger: true, // Enable detailed logs
    debug: true,  // Debug mode
  });
  
  transporter.sendMail({
    from: '"Isaac Oyekunle" <no-reply@etcvibes.com>',
    to: 'oyekunleisaac8@gmail.com',
    subject: 'Test Email',
    text: 'Hello, this is a test email!',
  }, (err, info) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Email sent:', info);
    }
  });
  