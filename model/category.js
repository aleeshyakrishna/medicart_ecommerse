const mongoose = require('mongoose')


const categorySchema= new mongoose.Schema({
    CategoryName:{
        type:String
    }
 })

 const category=mongoose.model('category',categorySchema)

 module.exports={category}