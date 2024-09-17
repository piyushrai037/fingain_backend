const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const Form = require('./models/Form');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API to handle form submission
app.post('/submit-form', async (req, res) => {
    const { name, phone, email, city, dematAccount, segment, invest } = req.body;

    try {
        // Save form data to MongoDB
        const newForm = new Form({ name, phone, email, city, dematAccount, segment, invest });
        await newForm.save();

        // Send email to the owner
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.OWNER_EMAIL,
            subject: 'New Demo Booking',
            text: `New booking request from ${name}.\nDetails:\nPhone: ${phone}\nEmail: ${email}\nCity: ${city}\nInvestment: ${invest}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred:', error);  // Log the detailed error
                return res.status(500).send({ message: 'Error sending email', error: error.message });
            }
            res.status(200).send({ message: 'Form submitted successfully and email sent' });
        });
        
    } catch (err) {
        res.status(500).send({ message: 'Error saving form data' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
