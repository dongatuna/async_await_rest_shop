const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require('../configuration');

module.exports = (req, res, next)=>{
    try{
        //get the token from the header
        const token = req.headers.authorization.split(" ")[1];
        //decode the token 
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userData = decoded;
        //called when authentication is successful
        next();
    }catch(error){
        res.status(401).json({
            message: "Auth failed"
        });
    }
    
    
}