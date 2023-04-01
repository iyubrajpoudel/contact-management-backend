const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

// Requiring dotenv
const dotenv = require("dotenv");
dotenv.config();

router.get("/", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "User route hitted!"
    });
});

router.get("/register", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "User registration route hitted!"
    });
});

router.post("/register", (req, res, next) => {
    const { name, username, email, password, userType } = req.body;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error while hashing password!",
                error: err
            })
        }
        else {
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
            .catch(err => {
                res.status(500).json({
                    success: false,
                    message: "Error occured while registering user!",
                    error: err
                });
            })
        }
    })
});


router.post("/login", (req, res, next) => {
    const { username, password } = req.body;
            // Object destructuring

    User.find({
        username: username
    })
    .exec()
    .then(user => {
        // console.log(user);
        // console.log(user.length);
        
        // Username do not exist case
        
        // if (user.length < 1)
        // if (user.length === 0)
        if (!user.length) 
        {
            return res.status(404).json({
                success: false,
                message: "User do not exist!"
            })
        }
        // Username exist case
        else{
            const [matchedUser] = user;
                // Array destructuring
            // console.log(matchedUser);
            // bcrypt.compare(password, user[0].password, (err, result){
            bcrypt.compare(password, matchedUser.password, (err, result)=>{
                if (err){
                    // console.log("Error : ", err);
                    return res.status(500).json({
                        success: false,
                        message: "Error occured while decrypting!",
                        // error: err
                    })
                }
                else{
                    console.log(result); 
                        // result consist boolean value i.e. true/false. If password matches it gives true else false.

                    // Password match case
                    if(result){
                        const token = jwt.sign({
                            name: matchedUser.name,
                            username: matchedUser.username,
                            email: matchedUser.email,
                            userType: matchedUser.userType,
                        }, 
                        "JWT_LOGIN_SECRET_KEY",
                        {
                            expiresIn: "24h"
                        });

                        if (token){
                            res.status(200).json({
                                success: true,
                                message: "Logged in successfully!",
                                data: {
                                    username: matchedUser.username,
                                    email: matchedUser.email,
                                    userType: matchedUser.userType,
                                    token: token
                                }
                            });
                        }
                    }
                    // Password not match case
                    else{
                        return res.status(401).json({
                            success: false,
                            message: "Password do not match!"
                        })
                    }
                }
            })
        }
    })
    .catch(err => {
        return res.status(500).json({
            success: false,
            message: "Error....!",
            error: err
        })
    })
})

module.exports = router;