const mongoose = require('mongoose')

// const orderSchema=new mongoose.Schema({
//     userId:{
//       type:mongoose.Schema.Types.ObjectId,
//       ref:'user',
//       required:true
  
//   },
  
//       items: [{
//           product:Array,
          
//         }],
//       paymentmethod:String,
//       total:Number,
//       address:{
//         name: String,
//         address: String,
//         city: String,
//         state: String,
//         zipcode: Number,
//         phone: Number,
//         email: String,
//         type: String,
//       },
//       // newAddress:{
//       //      type:mongoose.Schema.Types.ObjectId ,
//       //      ref:'address',
           
//       // },
//     status: { 
//       type: String, 
//       default: 'ordered'
//      },
//     created: { type: Date, default: Date.now },
//     // cancelReason:{
//     //   type:String,
      
  
//     // },
//     // additionalReason:{
//     //   type:String
//     // },
//     paymentStatus:{
//       type:String,
//       default:'Pending'
//     },
//     deliveredDate:{
//       type:Date
//     },
//     // returnPeriod:{
//     //   type:Number,
//     //   default:30
//     // },
//     // returnExpirationDate:{
//     //   type:Date
//     // }
  
//   })

const orderSchema = new mongoose.Schema({

  deliveryDetails:{
    name:String,
    address:String,
    post:String,
    city:String,
    mobile:String,
    pincode:String,
  },
  userId: mongoose.Schema.Types.ObjectId,
  paymentMethod: String,
  products:Array,
  status: String,
  totalAmount:String,
  // discount: {
  //   type: String
  // },
  date:Date,
  cartId:mongoose.Schema.Types.ObjectId,

  address:{
    type:mongoose.Schema.Types.ObjectId,
  ref:"address",
  },
});
// const orderSchema = new mongoose.Schema({
//   deliveryDetails: {
//     name: String,
//     address: String,
//     post: String,
//     city: String,
//     mobile: String,
//     pincode: String,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'user', // Reference to the user model
//   },
//   paymentMethod: String,
//   products: [Object], // You might want to define a product schema
//   status: String,
//   totalAmount: Number, // Use a numeric data type
//   date: Date,
//   cartId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'cart', // Reference to the cart model
//   },
//   address: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'address', // Reference to the address model
//   }
// });

  const order=mongoose.model('order',orderSchema)

  module.exports={order} 