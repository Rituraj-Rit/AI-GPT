let mongoose = require('mongoose')

let UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        }
    },
    password:{
        type:String,
        required:true
    }
})

let UserModel = mongoose.model('User', UserSchema)
module.exports = UserModel