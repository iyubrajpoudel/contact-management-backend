const jwt = require("jsonwebtoken");

const authenticate = (req, res, next)=>{
    try{
        const auth = req.headers.authorization;
        // console.log(auth);
        const token = auth.split(" ")[1]
        // console.log(token);
        const verify = jwt.verify(token, "JWT_LOGIN_SECRET_KEY");
        // console.log(verify);

        if (verify.userType === "admin"){
            next();
        }
        else{
            return res.status(500).json({
                success: false,
                message: "Unauthorized! Need admin privilege."
            })
        }
    }
    catch(err){
        return res.status(500).json({
            success: false,
            // message: "Invalid token!",
            message: "Unauthorized! Need admin privilege.",
            error: err
        })
    }
}

module.exports = authenticate;