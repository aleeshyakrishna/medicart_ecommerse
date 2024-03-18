  const mongoose = require('mongoose')
  // const productsSchema = new mongoose.Schema();

  const productSchema=new mongoose.Schema({
      Productname:{
        type:String
      },
      ProductDescription:{
        type:String
      },
      Quantity:{
        type:Number
      },
      MFDate:{
        type:Date
      },
      ExpiryDate:{
        type:Date
      },
      Image:{
        type:Array,
      
      },
      Price:{
      type:Number
      },
      Category:{
        type:String
      },
    
    })

    const product=mongoose.model('product',productSchema)

  module.exports={product}