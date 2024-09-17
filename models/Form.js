const mongoose = require('mongoose');

// Define the form schema
const formSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    city: String,
    dematAccount: String,
    segment: String,
    invest: Number,
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);
