const mongoose = require('mongoose')


const orderSchema = new mongoose.Schema({

    owner:String,
    date:Date,
    orderid:String,
    products:{},
    address: {
      type: String, // Change the data type to String
    },
    payment:String,
    paymentStatus:String,
    amount:String,
    orderStatus:String,
    coupon:String

   
})

const order=mongoose.model('order',orderSchema)

module.exports = {order}