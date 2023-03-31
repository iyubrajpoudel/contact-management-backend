const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Requiring dotenv
const dotenv = require("dotenv");
dotenv.config();

router.get("/", (req, res, next) =>{
    res.status(200).json({
        success: true,
        message: "User route hitted!"
    });
});

router.get("/register", (req, res, next) =>{
    res.status(200).json({
        success: true,
        message: "User registration route hitted!"
    });
});

router.post("/register", (req, res, next) =>{
    const {name , username, email, password, userType} = req.body;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash)=>{
        if(err){
            return res.status(500).json({
                success: false,
                message: "Error while hashing password!",
                error: err
            })
        }
        else{
            const hashedPassword = hash;
            const user = new User({
                name: name,
                username: username,
                email: email,
                password: hashedPassword,
                userType: userType
            });
            user.save()
            .then(result => {
                res.status(200).json({
                    success: true,
                    message: "User registered successfully!",
                    newUser: result
                });
            })
            .catch(err =>{
                res.status(500).json({
                    success: false,
                    message: "Error occured while registering user!",
                    error: err
                });
            })
        }
    })
});

module.exports = router;