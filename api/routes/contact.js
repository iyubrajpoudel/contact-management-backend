const express = require("express");
const router = express.Router();

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
    console.log(req.body);
    console.log(req.body.name);

    res.status(200).json({
    "success": true,
    "message": "App is running."
    });
});

// handeling GET request for contact/demo
router.get('/demo',(req, res, next)=>{
    res.status(200).json({
        "success": true,
        "message": "GET request on contact demo route."
    });
});

module.exports = router;