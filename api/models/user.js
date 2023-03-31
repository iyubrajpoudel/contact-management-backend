// Requiring Mongoose
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    userType: String
});

// Creating Model based on userSchema defined above
const userModel = mongoose.model("user", userSchema);

// Exporting model
module.exports = userModel;
