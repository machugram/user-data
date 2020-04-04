const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name:{ //Name Of User
        type: String
    },
    phone:{ //Phone of User 
        type: String
    },
    email:{ // Email Of User
        type: String
    },
    address:{ //Address Of User
        type: String
    }
})

module.exports = mongoose.model('User',UserSchema);