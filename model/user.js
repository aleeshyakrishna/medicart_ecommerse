const mongoose = require('mongoose')



const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        
    },
    blocked:{
    type:Boolean,
    default:false
    },

})

const user=mongoose.model('user',userSchema)

module.exports={user}