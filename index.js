require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Email Api')
})

app.post('/send-email', async (req, res) => {
    const { message, email_address, name, phone } = req.body;

    if (!message || !email_address) {
        return res.status(400).send('Missing required fields: subject and text');
    }

    // Create a transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.EMAIL_USER, // Use environment variables
            pass: process.env.EMAIL_PASS, // Use environment variables
        },
    });

    // Email options
    let mailOptions = {
        from: process.env.EMAIL_USER, // Use environment variable
        to: process.env.EMAIL_USER, // Send email to your own email address
        subject: 'Service Lead',
        text: `
        Name: ${name}
        Email Address : ${email_address}
        Phone Number : ${phone}
        Message : ${message}
        `,
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
