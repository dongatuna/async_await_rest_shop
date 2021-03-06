const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    signupmethod: {
        type: String,
        enum: ['facebook', 'google', 'local'],
        required: true
    },

    facebook: {
        id:{
            type: String,
        },
        email: {type: String, lowercase:true}
    },
    google: {
        id:{
            type: String,
        },
        email: {type: String, lowercase:true}
    },

    local:{
        email:
        {
            type: String, 
            //required: true, 
            //unique:true, 
            lowercase: true,
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        },
        password: {
            type: String
            //required: true
        }
    }
    
});


//this method gets called before the mongoose save method on object User
userSchema.pre('save', async function(next){
    try{
        if(this.signupmethod!=='local'){
            next();
        }
        //create salt
        const salt = await bcrypt.genSalt(10);
        //use bcrypt hash

        const passwordHash = await bcrypt.hash(this.local.password, salt);

        this.local.password = passwordHash;

        next();
    }catch(error){
        next(error);
    }
});
//this method is used to verify the password user 
userSchema.methods.validPassword = async function(newPassword){
    try{
        //find the user using email provided
        return await bcrypt.compare(newPassword, this.local.password);
        //use the bcrypt compare method
    }catch(error){
        throw new Error(error);
    }
}
const User = mongoose.model('User', userSchema);
module.exports = User;