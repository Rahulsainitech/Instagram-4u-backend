const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    photo: {
        type: String,
        default:'https://res.cloudinary.com/geeta9812/image/upload/v1641220289/cv__29__generated_nk00yb.jpg'
    },
    following:[{type:mongoose.Types.ObjectId,ref:'user'}],
    follower:[{type:mongoose.Types.ObjectId,ref:'user'}]

})

module.exports = mongoose.model("user",userSchema)