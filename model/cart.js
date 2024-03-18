const mongoose = require('mongoose')


const cartSchema=new mongoose.Schema({
    userid:mongoose.SchemaTypes.ObjectId,
    products:[
        {
            productid :{type:
                mongoose.SchemaTypes.ObjectId},
                quantity:{ type: Number }
               
        }
    ]
  })

  const Cart=mongoose.model('cart',cartSchema)

  module.exports={Cart} 