// server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sendEmail from './sendEmail.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/send-email', async (req, res) => {
  try {
    await sendEmail();
    res.status(200).send('Email sent successfully');
  } catch (error) {
    res.status(500).send('Error sending email');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
