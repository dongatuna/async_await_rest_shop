const mongoose = require('mongoose');
const User = require('../models/user');
const JWT = require('jsonwebtoken');
const {JWT_SECRET} = require('../configuration');

//create a signToken function

signToken = (user) =>{
    return JWT.sign({
        iss: "Don",
        sub: user.id,
        iat: new Date().getTime(), //current time
        exp: new Date().setDate(new Date().getDate()+1) //current time + 1 day ahead
    }, JWT_SECRET);
}
module.exports = {

    signUp: async(req, res, next)=>{
        try{
            const { email, password } = req.value.body;
            //check if the user exists
            const result = await User.findOne({email});
            
            if(result){
                res.status(409).json({
                    message: "The email has been taken"
                });
            }

            //create new user
            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                email,
                password
            });

            //save the user
            await newUser.save();

            //Generate the token
            const token = signToken(newUser);
            console.log(token);
            //Respond with the token
            res.status(200).json({token});
            
        }catch(error){

        }
    },

    signIn: async(req, res, next)=>{
        //The signin is handled by passport.js - 
        
        const token = signToken(req.user);
        console.log(token);

        res.status(200).json({token});
    },

    secret: async (req, res, next) =>{
        console.log('I managed to get here');
        res.json({secret: "resource"});
    }
}