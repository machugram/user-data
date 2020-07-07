const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const saltRounds = 10;
const bcrypt = require('bcrypt');
const UserSchema = new Schema({
    name:{ //Name Of User
        type: String,
        trim: true,
        required:true
    },
    phone:{ //Phone of User 
        type: String,
        trim: true,
        required:true

    },
    email:{ // Email Of User
        type: String,
        lowercase: true,
        trim: true,
        required:true

    },
    address:{ //Address Of User
        type: String,
        trim:true
    },
    password: {
        type: String,
        required:true,
        trim:true

    },

    token:{
        type:String
    },
    resetPasswordToken: {String},
    resetPasswordExpires: {Date},
    resetLink:{
        data:String,
        default:""
    }
},
{timestamps: true}
)
// UserSchema.pre('save', function(next){
//     this.password = bcrypt.hashSync(this.password, saltRounds);
//     next();
//     });
module.exports = mongoose.model('User',UserSchema);