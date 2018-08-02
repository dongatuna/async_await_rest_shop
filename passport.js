const mongoose = require('mongoose');
const passport = require('passport');
const JwtStrategy =  require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const {JWT_SECRET} = require('./configuration');

const User = require("./models/user");


//JSON WEB TOKENS STRATEGY

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey:JWT_SECRET
},  async(payload, done)=>{
    try{
        //find the user specified in the token
        const user = await User.findById(payload.sub);

        //if the user doesn't exist, return empty object and false 
        if(!user){
            return done(null, false);            
        }

        //Otherwise, return the user
        done(null, user);

    }catch(error){
        done(error, false);
    }
}));


//GOOGLE OAUTH STRATEGY

passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: "510465647938-dv862rsa4r8rmaarteqp6rpakq4t0eqo.apps.googleusercontent.com",
    clientSecret: "vA6cSFbARbn6vq02FsdQdxcq"
}, async(accessToken, refreshToken, profile, done)=>{

    try{
        console.log("This is the access Token ", accessToken);
        console.log("This is the refresh Token ", refreshToken);
        console.log("This is the profile ", profile);

        //Check whether the current user exists in our DB
        const existingUser = await User.findOne({"google.id":profile.id});
        if(existingUser){
            return done(null, existingUser);
        }

        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            signupmethod: 'google',
            google:{
                id: profile.id,
                email: profile.emails[0].value
            }
        });
        
        await newUser.save();
        done(null, newUser);

    }catch(error){
        done(error, false, error.message);
    }
    
}));
//LOCAL STRATEGY - to log in users

passport.use(new LocalStrategy({
    usernameField: "email"
}, async(email, password, done )=>{
    try{
        //Find the user given the email
        const user = await User.findOne({"local.email":email});

        //If not user, handle it
        if(!user){
            return done(null, false);
        }

        //Check if the password is a match
        const isMatch = await user.validPassword(password);

        //If not user, inform user
        if(!isMatch) return done(null, false);

        //Otherwise, return the user
        done(null, user);
    }catch(error){
        done(error, false);
    }
}));