const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const authenticate = require("../middlewares/authenticate");
const adminAuthenticate = require("../middlewares/admin_authenticate");

// Requiring dotenv
const dotenv = require("dotenv");
dotenv.config();

// Cloudinary Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_USER_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:  process.env.CLOUDINARY_API_SECRET
  });

// setting the different requests for differnt routes

// handeling GET request for contact/
router.get('/', authenticate, (req, res, next)=>{
    Contact.find()
    .then(result=>{
        res.status(200).json({
            success: true,
            message: "Data fetched successdfully!",
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

// handeling POST request for contact/
// router.post('/',(req, res, next)=>{
//     res.status(200).json({
//         "success": true,
//         "message": "POST request on contact route"
//     });
// });

router.get("/:id", authenticate, (req, res, next)=>{
    // console.log(req.params.id);
    const {id} = req.params;
    Contact.findById(id)
    .then(result=>{
        res.status(200).json({
            status: true,
            message: "Data fetched successfully",
            data: result
        });
    })
    .catch(err=>{
        res.status(500).json({
            success: false,
            message: "Error occured!",
            error: err
        })
    })
})


//converting cloudinary image URL into image name
const cloudinaryImagePathToName = (path) => {
    const temp = path.split('/');
    const temp2 = temp[temp.length - 1].split('.');
    const imageName = temp2[0];
    return imageName;
}


// Contact.findById(id)
// .then(result=>{
//     console.log(data);
// })
// .catch(err=>{
//     console.log(err);
// })

//Delete request using query
router.delete("/", adminAuthenticate, (req, res, next)=>{
    const {id, image} = req.query;

    let imageName = cloudinaryImagePathToName(image);

    Contact.deleteOne({_id: id})
    .then(result=>{
        res.status(200).json({
            success: true,
            message: "Data deleted successfully",
            result: result
        });
        cloudinary.uploader.destroy(imageName, (error, result)=>{
            error ? console.log(error) : console.log(result);
        });
    })
    .catch(err=>{
        res.status(500).json({
            success: false,
            message: "Error occured!",
            error: err
        })
    })
})

// Delete request using params
router.delete("/:id", adminAuthenticate, (req, res, next)=>{
    // console.log(req.params.id);
    const {id} = req.params;
    // Find a user by ID
    // const data = Contact.findOne({_id: id});
    // const data = Contact.findOne({_id: id});
    // const data = Contact.findById(id);
    // console.log(data);
    
    // for deleting image from cloudinary we need image name
    let imageName = "";
    Contact.findById(id)
    .then(result=>{
        console.log(result);
        const imagePath = result.image;
        // console.log(imagePath);
        imageName = cloudinaryImagePathToName(imagePath);
        // console.log(imageName)
    })
    .catch(err=>{
        console.log(err);
    })

    Contact.deleteOne({_id: id})
    .then(result=>{
        cloudinary.uploader.destroy(imageName, (error, result)=>{
            // if (error){
            //     console.log(error);
                // res.status(500).json({
                //     success: false,
                //     message: "Error deleting image from cloudinary.",
                //     error: error
                // });
            // }
            // else{
            //     console.log(result);
            // }
            error ? console.log(error) : console.log(result);
        });
        res.status(200).json({
            success: true,
            message: "Data deleted successfully",
            result: result
        });
    })
    .catch(err=>{
        res.status(500).json({
            success: false,
            message: "Error occured!",
            error: err
        })
    });
})


// put request
router.put("/:id", adminAuthenticate, (req, res, next)=>{
    // console.log(req.params.id);
    const {id} = req.params;
    const {name, email, phone} = req.body;
    const image = req.files.image;
    cloudinary.uploader.upload(image.tempFilePath, (err,result)=>{
        if(err){
            console.log("Error: " , err);
            res.status(500).json({
                success: false,
                message: "Cloudinary error!",
                error: err
            })
            return;
        }
        if(result){
            let imageURL = result.url;
            Contact.findOneAndUpdate({_id: id},{$set:{
                name: name,
                email: email,
                phone: phone,
                image: imageURL
            }})
            .then(result=>{
                res.status(200).json({
                    success: true,
                    message: "Data updated successfully",
                    result: result
                });
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: "Error occured!",
                    error: err
                });
            })
        }
    })
})


router.post('/test',(req, res, next)=>{
    const file = req.files.image;
    const uploadToCloudinary = (file)=>{
        cloudinary.uploader.upload(file.tempFilePath, (err,result)=>{
            if(err){
                console.log("Error: " , err);
                res.status(500).json({
                    success: false,
                    message: "Error Occured",
                    error: err
                })
            }
            if(result){
                console.log("Result: ", result);
                console.log(result.url);
                res.status(200).json({
                    success: true,
                    message: "Image Uploaded to Cloudinary Successfully!",
                    result: result
                })
            }
        })
    }
    uploadToCloudinary();
});


router.post('/', adminAuthenticate, (req, res, next)=>{
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
    // res.writeHead(200, {'Content-Type': 'application\json'});


/*     
    const getCloudinaryPath = (file)=>{
        let filePath = "345";
        cloudinary.uploader.upload(file.tempFilePath, (err,result)=>{
            if(err){
                console.log("Error!" , Error);
                console.log(filePath);
                return filePath;
            }
            if(result){
                console.log("Success!", result);
                filePath = result.url;
                console.log(filePath);
                return filePath;
            }
        })
    };

 */
    // const image = req.files.image;
    // const imageURL = await getCloudinaryPath(req.files.image);
    // const imageURL = "xyz" || await getCloudinaryPath(req.files.image);
    // console.log(imageURL)

    const image = req.files.image;
    cloudinary.uploader.upload(image.tempFilePath, (err,result)=>{
        if(err){
            console.log("Error!" , Error);
            res.status(500).json({
                success: false,
                message: "Cloudinary Error!",
                error: err
            })
            return;
        }
        if(result){
            const contact = new Contact({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                image: result.url
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
            return;
        }
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