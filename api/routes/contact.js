const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");
const mongoose = require("mongoose");

// setting the different requests for differnt routes

// handeling GET request for contact/
router.get('/',(req, res, next)=>{
    res.status(200).json({
        "success": true,
        "message": "GET request on contact route"
    });
});

// handeling POST request for contact/
// router.post('/',(req, res, next)=>{
//     res.status(200).json({
//         "success": true,
//         "message": "POST request on contact route"
//     });
// });
router.post('/',(req, res, next)=>{
    // console.log(req.body);
    // console.log(req.body.name);

    // const contact = new Contact({
    //     name: "Yubraj"
    //     email: "yubraj@gmail.com"
    //     phone: 8686897
    //     image: "https://huigi@gmail.com"
    // })

    // const contact = new Contact({
    //     _id: new mongoose.Types.ObjectId,
    //     name: req.body.name,
    //     email: req.body.email,
    //     phone: req.body.phone,
    //     image: req.body.image
    // })
    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.body.image
    })
    contact.save()
    .then(result => {
        // console.log(result);
        res.status(200).json({
            success: true,
            message: "Data added successfully!",
            data: result 
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server side error",
            error: err 
        })
    })
});

// handeling GET request for contact/demo
router.get('/demo',(req, res, next)=>{
    res.status(200).json({
        "success": true,
        "message": "GET request on contact demo route."
    });
});

module.exports = router;