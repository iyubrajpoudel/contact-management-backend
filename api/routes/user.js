const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

// Requiring dotenv
const dotenv = require("dotenv");
dotenv.config();

/* router.get("/", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "User route hitted!"
    });
}); */

router.get('/', (req, res, next)=>{
    User.find()
    .then(result=>{
        res.status(200).json({
            success: true,
            message: "All users fetched successdfully!",
            data: result
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Error occured!",
            error: err
        })
    })
});


router.get("/register", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "User registration route hitted!"
    });
});

router.post("/register", async(req, res, next) => {
    const { name, username, email, password, userType } = req.body;

    // Fields Regex validations {

        // Regular expression for full name validation
        const fullNameRegex = /^[a-zA-Z\s]+$/;
    
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        // Regular expression for username validation
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    
        if (!fullNameRegex.test(name)){
            return res.status(500).json({
                success: false,
                message: "Enter a valid name!"
            })
        }
        if (!emailRegex.test(email)){
            return res.status(500).json({
                success: false,
                message: "Enter a valid email address!"
            })
        }
        if (!usernameRegex.test(username)){
            return res.status(500).json({
                success: false,
                message: "Enter a valid username!"
            })
        }

    // } 

    // checking exixting username or email {
    
        let isEmailRegistered = await User.findOne({email});
        if (isEmailRegistered){
            return res.status(500).json({
                success: false,
                message: "Email is already registered! You can login"
            })
        }
    
        let isUsernameTaken = await User.findOne({username});
        if (isUsernameTaken){
            return res.status(500).json({
                success: false,
                message: "Username is already taken! Kindly try another username.",
            })
        }
    
    // } checking exixting username or email

    // checking strong password {

    // Regular expression for strong password validation
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+{}[\]|;:'",.<>/?]).{10,}$/;
    /* regex for password of 10 or more characters, at least one uppercase & lowercase characters, at least one number, and at least one symbol */
    
    if (!strongPasswordRegex.test(password)){
        return res.status(500).json({
            success: false,
            message: "Kindly use a strong password (criterian : 10+ characters, one or more uppercase, lowercase, number and symbols.)"
        })
    }
    
    // } checking strong password

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