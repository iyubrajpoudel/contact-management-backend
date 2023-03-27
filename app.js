// Requiring express
const express = require("express");

// Creating express app
const app = express();

// Requiring body-parser
const bodyParser = require("body-parser");

// Requiring express-fileupload
const fileUpload = require("express-fileupload");


// Requiring dotenv
const dotenv = require("dotenv");
dotenv.config();

// Requiring Mongoose
const mongoose = require("mongoose");

// mongoose.connect(CONNECTION_STRING)
// mongoose.connect(mongodb+srv://random:<password>@random.rshnxb7.mongodb.net/?retryWrites=true&w=majority)

//connecting mongodb atlas with our api
const mongodbClusterPassword = process.env.MONGODB_ATLAS_CLUSTER_PASSWORD;
const mongodbConnectionString = `mongodb+srv://random:${mongodbClusterPassword}@random.rshnxb7.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongodbConnectionString);

//ensure successful connection

// on connection error
mongoose.connection.on("error",(err)=>{
    console.log("Connection failed !");
    console.log("Error: ", err);
})

// on successful connection
mongoose.connection.on("connected", (conn)=>{
    console.log("Connected successfully!");
})

//using bodyParser
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//using fileupload
app.use(fileUpload({
    useTempFiles : true,
    // tempFileDir : '/tmp/'
}));

//Importing Routes
const contactRoute = require("./api/routes/contact");

// Using routes in app
app.use("/contact", contactRoute);

// using middleware in express
// app.use()

// app.use("/",(req, res, next)=>{
//     res.status(200).json({
//         "success": true,
//         "message": "App is running."
//     });
// });

// Handle undefined url
app.use((req, res, next)=>{
    res.status(404).json({
        "error": true,
        "message": "Page Not Found"
    })
});


// Exporting app
module.exports = app;