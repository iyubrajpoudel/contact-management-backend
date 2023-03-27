// Requiring Mongoose
const mongoose = require("mongoose")

// Defining Schema for our contact collection
// const contactSchema = new mongoose.Schema({
//     _id: mongoose.Schema.Types.ObjectId,
//     name: String,
//     email: String,
//     phone: Number,
//     image: String
// })
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    image: String
})

// Creating Model based on contactSchema defined above
const contactModel = mongoose.model("Contact", contactSchema);

// Exporting modle
module.exports = contactModel;
