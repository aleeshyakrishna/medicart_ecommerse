const mongoose = require('mongoose')


const addressSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    addresses:[{
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipcode: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    type: {
      type: String,
    },
}]
  });

  const address=mongoose.model('address',addressSchema)

  module.exports={address} 