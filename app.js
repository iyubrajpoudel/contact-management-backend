// Requiring express
const express = require("express");

// Creating express app
const app = express();

//Importing Routes
const contactRoute = require("./api/routes/contact");

// Using routes in app
app.use("/contact", contactRoute);

// using middleware in express

// app.use((req, res, next)=>{
//     res.status(200).json({
//         "success": "true",
//         "message": "App is running."
//     })
// });

app.use("/",(req, res, next)=>{
    res.status(200).json({
        "success": true,
        "message": "App is running."
    });
});

// Exporting app
module.exports = app;