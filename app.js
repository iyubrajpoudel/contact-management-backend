// Requiring express
const express = require("express");

// Creating express app
const app = express();

// using middleware in express
app.use((req, res, next)=>{
    res.status(200).json({
        "success": "true",
        "message": "App is running"
    })
});

// Exporting app
module.exports = app;