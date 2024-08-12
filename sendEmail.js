
// sendEmail.js
import nodemailer from 'nodemailer';

// Replace with your Mailtrap credentials
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  port: 2525,
  auth: {
    user: 'munnarjuly@gmail.com', // Replace with your email
    pass: 'ubhh ocho gjkl mtte',
  },
});

const sendEmail = async () => {
  const mailOptions = {
    from: 'munnarjuly@gmail.com', // Sender address
    to: 'tariqahamed.26121998@gmail.com', // List of recipients
    subject: 'Critical alarm', // Subject line
    text: 'Hello, critical alarm check the log for details ', // Plain text body
    html: '<strong>Hello, critical alarm check the log for details</strong>', // HTML body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ' + error);
  }
};

export default sendEmail;





// import express from 'express';
// import nodemailer from 'nodemailer';
// import cors from 'cors';

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors({
//   origin: 'https://localhost:5173', // Replace with the URL of your frontend application
// }));
// app.use(express.json());

// app.post('/send-email', async (req, res) => {
//   const { to, subject, text } = req.body;

//   try {
//     // Create a transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//       service: 'Gmail', // You can use other services like 'Yahoo', 'Outlook', etc.
//       auth: {
//         user: 'munnarjuly@gmail.com', // Replace with your email
//         pass: 'ubhh ocho gjkl mtte', // Replace with your app password
//       },
//     });

//     // Setup email data
//     let mailOptions = {
//       from: 'munnarjuly@gmail.com', // Replace with your email
//       to: to,
//       subject: subject,
//       text: text,
//     };

//     // Send mail
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error);
//         return res.status(500).send('Error sending email');
//       }
//       res.send('Email sent: ' + info.response);
//     });
//   } catch (error) {
//     console.error('Unexpected error:', error);
//     res.status(500).send('Unexpected error');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


