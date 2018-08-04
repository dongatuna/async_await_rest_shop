const mongoose = require('mongoose');
const User = require('../models/user');
const JWT = require('jsonwebtoken');
const config = require('../configuration');

//create a signToken function

signToken = (user) =>{
    return JWT.sign(        
        {
            iss: "Don",
            sub: user.id,
            iat: new Date().getTime(), //current time
            exp: new Date().setDate(new Date().getDate()+1), //current time + 1 day ahead
            email: user.email,
            userId: user._id
        },
        config.JWT_SECRET
   
    );
}
module.exports = {

    signUp: async(req, res, next)=>{
        try{
            const { email, password } = req.value.body;
            //check if the user exists
            const result = await User.findOne({email});
            
            console.log(email, password);

            if(result){
                res.status(409).json({
                    message: "The email has been taken"
                });
            }

            console.log("User has not been saved...");
            //create new user
            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                signupmethod: 'local',
                local:{
                    email,
                    password
                }
                
            });

            console.log("newUser Email ", newUser.email, "Password", newUser.password);
            //save the user
            await newUser.save();

            //console.log("new user ", newUser);
            //Generate the token
            const token = signToken(newUser);
            console.log(token);
            //Respond with the token
            res.status(200).json({token});
            
        }catch(error){
            res.status(401).json({
                message: "Authentication failed"
            });
        }
    },

    signIn: async(req, res, next)=>{
        //The signin is handled by passport.js - 
        
       const token = signToken(req.user);
        //console.log(token);

        res.status(200).json({token});
    },

    facebookOAuth: async(req, res, next)=>{
        console.log("Facebook authentication... ");

        console.log("req.user", req.user);

        const token = signToken(req.user);
        res.status(200).json({token});

    },

    googleOAuth: async(req, res, next)=>{
        //Generate token
        console.log("Google got me here");

        console.log(req.user);

        const token = signToken(req.user);
        res.status(200).json({token});
    },

    secret: async (req, res, next) =>{
        console.log('I managed to get here');
        res.json({secret: "resource"});
    }
}