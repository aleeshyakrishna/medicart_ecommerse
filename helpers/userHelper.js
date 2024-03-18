const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {user}= require("../model/user")
const db= require("../model/user")
const {product} = require("../model/product");
const Category=require('../model/category')
// const { ObjectId } = require('mongodb');
// const { isObjectIdOrHexString } = require("mongoose");
const {Cart} =require('../model/cart')
const {address}= require('../model/address')
const {order}= require('../model/order')

const { response } = require("../app");


module.exports = {
//OG
doSignUp: (userData) => {
  let response = {};
  return new Promise(async (resolve, reject) => {
    try {
      const email = userData.email;
      const existingUser = await user.findOne({ email });
      if (existingUser) {
        response = { status: false };
         
      } else {

   try{
    
    const password = String(userData.password);
    const hashPassword = await bcrypt.hash(password, 10);
    const data = new user({
      name: userData.name, // Make sure the 'name' field is present
      email: userData.email,
      password: hashPassword,
      mobile: userData.mobile, // Make sure the 'mobile' field is present
    }
)
    
    console.log("?????????????????");
      console.log(data);
    await data.save(data).then(res => {
      console.log(res,">>>>>>>>>>>>")
      resolve(res);
    });

   }catch (err){
      console.log(err);
      
   }
      }
    } catch (err) {
      console.log("errorrrrrrrrrr");
      console.log(err);
      
    }
  });
},


//OG
// dologin: (userData) => {
//   console.log('oijoijojo');
//   console.log(userData,'aaaaaaaa')
//   return new Promise(async (resolve, reject) => {
//     try {
    
//       let users = await user.user.findOne({ email: userData.email });
//       console.log(users);
//       if (users) {
//         console.log('checjejj');
//         let match=  bcrypt.compare(userData.password,users.password)
//         if(match){
  
//   console.log('login successfull');
//   resolve(users)
//  }
//         }else{
//           console.log('not working');
//         }  
//     } catch (err) {
//       console.log(err);
//     }
//   });
// },


// sir
dologin:(userData)=>{
   return new Promise(async(resolve,reject)=>{
    let loginStatus=false
    let response={}
    let user = await db.user.findOne({ email: userData.email });
      if (user){
        bcrypt.compare(userData.password,user.password).then((status)=>{
          if(status){
            console.log("login success")
            response.user=user
            response.status=true
            resolve(response)
          }else{
            console.log('login failed')
            resolve({status:false})
          }
        })
      }else{
        console.log('login failed')
        resolve({status:false})
      }
   })
},


findUser :(mobileno) =>{
  return new Promise((resolve, reject) =>{
      db.user.findOne({mobile : mobileno}).then((user) =>{
          if(user){
              resolve(user)
          }else{
              resolve(null);
          }
      })
  })
},

getProducts: () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await product.find();
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
},

getcategory:()=>{
return new Promise(async(resolve, reject) => {
  try {
    const response=await Category.category.find();
    resolve(response)
   
  } catch (error) {
    reject(error)
  }
})
},




addCart:  (userid, proId) => {
  console.log('..........................>>>>>>>>');
  return new Promise (async (resolve,reject)=>{
    let usercart = await Cart.findOne({userid:new mongoose.Types.ObjectId(userid)})
    let Product=await product.findOne({_id:new mongoose.Types.ObjectId(proId)})

    if(!usercart){
      console.log("cart is emptyyyyyyyyyy");
      let userCart=new Cart({
        userid,
        products:[{
          productid : proId,
          quantity : 1
        }]
      })

      await userCart.save().then(async ()=>{

       
      

        Product.Quantity--
        Product.save().then(res=>{
            console.log("saved and decrement");
        })
      
      })
      resolve()
      
    }else{
      console.log("elsec csasssssssssssssssssssssssss");


      if(Product.Quantity>0){
        console.log("elsec csasssssssssssssssssssssssss");
      //let itemFound
   let Index= usercart.products.findIndex(item=>item.productid.toString()===proId)

  console.log(Index);
  if(Index>=0){
    usercart.products[Index].quantity++
    usercart.save().then(async (res)=>{
      
      


      
    })

  }else{


  console.log('yuuhug8guyghugu');
    usercart.products.push({productid:proId,quantity:1})
    usercart.save().then(async (res)=>{

      
    

    })
  }
   resolve()
      }

      else{
        console.log('out of stock');

      }

}
    console.log('>>>>>>>>>>>'+usercart);
 })
  },


   
    
  
  // changeQuantity: async (req, res) => {
  //   console.log(req.body, "dddddddddddddddd");
  //   let stock;
  //   await userhelpers.zoomlistProductShop(req.body.product).then((response) => {
  //     console.log(response, "responseessssss");
  //     stock = response.Quantity;
  //     console.log(response.Quantity, "quantititityyy");
  //   });
  //   console.log(req.body.quantity, "alalalalalal");

  //   if (req.body.quantity >= stock) {
  //     console.log("out of stock!");
  //     res.json({ stock: true });
  //   } else {
  //     userhelpers
  //       .change_Quantity(req.body)
  //       .then(async (response) => {
  //         // response.total = await userhelpers.getsubTotal(req.session.user._id)
  //         // console.log(response,"subtotal respoonse................");
  //         res.json(response);
  //       })
  //       .catch((error) => {
  //         res.status(500);
  //       });
  //   }
  // },



getCartProducts: (userid) => {
 
  return new Promise(async (resolve, reject) => {
    try {
     
     
      let cartPro = await Cart.aggregate([
        [
          {
            '$match': {
              'userid': new mongoose.Types.ObjectId(userid)
            }
          },
           {
            '$unwind': {
              'path': '$products'
            }
          },
           {
            '$lookup': {
              'from': 'products', 
              'localField': 'products.productid', 
              'foreignField': '_id', 
              'as': 'res'
            }
          }

          
        ],
      ]);
     
      
      resolve(cartPro);
    } catch (error) {
      reject(error); // Use reject instead of resolve to handle errors.
    }
  });
},

productFomCart:(userid)=>{
  return new Promise(async (resolve, reject) => {
    try {
     
     
      let cartPro = await Cart.aggregate([
        {
          '$match': {
            'userid': new mongoose.Types.ObjectId(userid)
          }
        },
        {
          $lookup: {
            'from': 'products', 
            'localField': 'products.productid', 
            'foreignField': '_id', 
            'as': 'res'
          }
        },
        {
          $unwind: '$res'
        },
        {
          $project: {
            'res._id': 1,
            'res.Productname': 1,
            'res.ProductDescription': 1,
            'res.Image': 1,
            'res.Price': 1,
            'res.Category': 1
          }
        }
      ]);
      
     
      resolve(cartPro);
    } catch (error) {
      reject(error); // Use reject instead of resolve to handle errors.
    }
  });
},
change_Quantity : (sign,productId,userId) => {

  return new Promise(async (resolve,reject)=>{
  let value= parseInt(sign)
  console.log(value);
    let cart=  await Cart.findOne({userid:new mongoose.Types.ObjectId(userId)})

    let products=cart.products
    for(let product of products){
      console.log("loop",product.productid.toString());
      if(product.productid.toString()==productId){
        console.log('hhhhh');
        if(value===1){
          product.quantity++
        }else{
          product.quantity--
        }
      
      
      }
   
    }

    await cart.save().then(async (res)=>{

      
    
      let aggregateResult= await Cart.aggregate([
        {
          '$match': {
            'userid': new mongoose.Types.ObjectId(userId)
          }
        }, {
          '$unwind': {
            'path': '$products'
          }
        }, {
          '$lookup': {
            'from': 'products', 
            'localField': 'products.productid', 
            'foreignField': '_id', 
            'as': 'results'
          }
        }, {
          '$unwind': {
            'path': '$results'
          }
        }
      ])
      const result = aggregateResult
      console.log(result,"kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");

       resolve(result)
      console.log("successfully quantity updated,"+result);
    })

    
  })















  details.count = parseInt(details.count)
  details.quantity = parseInt(details.quantity)

  return new Promise((resolve, reject) => {
      if (details.count == -1 && details.quantity == 1) {
          Cart.findOneAndUpdate({
              _id: details.cart
          }, {
              $pull: {
                  products: {
                      product: ObjectId(details.product)
                  }
              }
          }).then((response) => {
              resolve({removeProduct: true})
          }).catch((error) => {
              reject()
          })
      } else {

          db.cart.findOneAndUpdate({
              _id: details.cart,
              "products.product": ObjectId(details.product)
          }, {
              $inc: {
                  "products.$.quantity": details.count
              }
          }).then((response) => {
              resolve({status: true})
          }).catch((error) => {
              reject()
          })
      }


  })

},


addUserAddress: (userId, data) => {

  return new Promise(async (resolve, reject) => {
    try {
      let addressCart = await address.findOne({ userId:new mongoose.Types.ObjectId(userId) });
      console.log(addressCart);

      if (!addressCart) {
        addressCart = new address({
          userId: userId,
          addresses: [
            {
              name: data.name,
              address: data.address,
              city: data.city,
              state: data.state,
              zipcode: data.zipcode,
              phone: data.phone,
              email: data.email,
              type: data.type,
            },
          ],
        });
      } else {
        addressCart.addresses.push({

          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          zipcode: data.zipcode,
          phone: data.phone,
          email: data.email,
          type: data.type,
        });
      }
      
      // Save the updated document
      await addressCart.save();
      resolve(addressCart);
    } catch (err) {
      reject(err);
    }
  });
},


//OG
// placeOrder:(order,products,userId,addresId,totalAmount)=>{

//   return new Promise(async (resolve,reject)=>{
//     console.log(order,products);
//       const selectedAddress=await address.findOne({
//         userId: new mongoose.Types.ObjectId(userId),
//         addresses: {
//           $elemMatch: {
//             _id: new mongoose.Types.ObjectId(addresId)
//           }
//         }
//       },
//       {
//         "addresses.$": 1
//       })
//       const cart=await cart.findOne({userId})
//       // const coupon=[]
//       // if(cart.couponStatus){
//       //   let couponCode=cart.couponCode
//       //  coupon=await Coupon.findOne({code:couponCode})
       
//       // }
      
//       //userAddress.findOne({userId})
//       console.log("(((((((((((((((((((");
//       console.log(order)
//     let status=order['payment-method']==='POD'?'placed':'pending'
//     const orderItem=new order({
//       userId:userId,
//       total:totalAmount
//       ,
//       items:[{
//         product:products
//       }],
//       address:{
        
//         name: selectedAddress.addresses[0].name,
//         address: selectedAddress.addresses[0].address,
//         city: selectedAddress.addresses[0].city,
//         state: selectedAddress.addresses[0].state,
//         zipcode: selectedAddress.addresses[0].zipcode,
//         phone: selectedAddress.addresses[0].phone,
//         email: selectedAddress.addresses[0].email,
//         type: selectedAddress.addresses[0].type,
//     },
//     newAddress:order.order,
//     status:status, 
//     paymentmethod:order['payment-method']
    

//     })
//     orderItem.save().then(async(response)=>{
//     console.log('helo haiiin this is my test')
//        console.log(response._id)
//        if(cart.couponStatus){
//         let coupon=await Coupon.findOne({code:cart.couponCode})
//         coupon.usedBy.push(userId)
        
//         coupon.save().then(response=>{
//           if(order['payment-method']==='POD'){
//             cart.findOneAndDelete( {userId:new mongoose.Types.ObjectId(userId)}).then(respomse=>{
//              resolve(orderItem)
//            })
//           }else{
//             resolve(orderItem)
//           }
          
          

//         })
//          }
//          else{
//           if(order['payment-method']==='POD'){
//             cart.findOneAndDelete( {userId:new mongoose.Types.ObjectId(userId)}).then(respomse=>{
//             resolve(orderItem)
//           })
//           }else{
//             resolve(orderItem)
//           }
          
          
//          }    
    
          
      
      
//     }).catch((err)=>{
//       reject(err)
//     })
  

//   })

  
// },


getAddress:(userid)=>{
  return new  Promise(async(res,rej)=>{
    let addresses = await address.findOne({ userId:new mongoose.Types.ObjectId(userid) });
    console.log(addresses,"..............>>");
    res(addresses)
  })
},
getOneAddress:async(userId,addressId)=>{
  return new Promise(async (resolve, reject) => {
    try {
      // Find the address document based on userId
      const addressDocument = await address.findOne({ userId });

      if (!addressDocument) {
        console.log('User address not found');
        resolve(null);
        return;
      }

      // Find the address object within the addresses array based on addressId
      const foundAddress = addressDocument.addresses.find((addressObj) => addressObj._id == addressId);

      if (foundAddress) {
        console.log('Address found:', foundAddress);
        resolve(foundAddress);
      } else {
        console.log('Address not found');
        resolve(null);
      }
    } catch (error) {
      console.error('Error finding address:', error);
      reject(error);
    }
  });
},




postplaceorder:(userId,cart,address,method,total,phone)=>{
  console.log(address,"vannu mwooneee/.......")
  function generateUniqueID(time, number1) {

    const uniqueID = `${time}${number1}`;
    return uniqueID;
  }
  let currentDate1 = new Date();
  let time = currentDate1.getTime();
  let ph = phone[7] + phone[8] + phone[9];
  let oid = generateUniqueID(time, ph);
  console.log(oid);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

  return new Promise ( async (resolve ,reject ) =>{
    let currentDate = new Date();
     let Order=  new order({
        
        owner: userId,
        date: currentDate.toDateString(),
        products: cart,
        orderid: oid,
        address:address,
        payment: method.paymentMethod,
        paymentStatus: "pending",
        amount: total,
        orderStatus: "placed",
        
      })

      Order.save().then(res=>{
        resolve(res)
      })
     
      })
},

search:(details)=>{
  // console.log(details,"000000000000");
  return new Promise(async(resolve, reject) => {
    try {
      const searchValue = details.search;
      let Products = await product.find({
        'Productname': { $regex: `.*${searchValue}.*`, $options: 'i' }
      });
     
      resolve(Products);
      // console.log(Products,"oioioioiuhgfghnbvv");
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
    

},
categorySearch:(categoryId)=>{
  console.log(categoryId,"jjj");
  return new Promise(async(resolve,reject)=>{
    let cate= await  Category.category.find({_id:categoryId})
    resolve(cate)
  })
},


getCat: (category) => {
  return new Promise(async (resolve, reject) => {

    
    let cateProd= await product.find({Category:category})
    resolve(cateProd)
    
  });
},

changePassword: (pass,currentPassword,newPassword,email) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Find the user by their email
      const existingUser = await user.findOne({ email: email });
      console.log(existingUser,"user existing...............");
      // Check if the user exists
      if (!existingUser) {
        return resolve({ status: false, message: 'User not found' });
      }

      // Compare the current password with the stored hashed password
      const passwordMatch =  bcrypt.compare(currentPassword, existingUser.password);
    

      // console.log(passwordMatch,"password matching..................>");
      // If passwords don't match, return an error
      if (!passwordMatch) {
        console.log("password not matching");
        return resolve({ status: false, message: 'Current password is incorrect' });
      }

      // Hash the new password
      const hashPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password with the new hashed password
      existingUser.password = hashPassword;
      await existingUser.save();

      // Password changed successfully
      resolve({ status: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
},

// orderDetails: (userid) => {
//   console.log(userid, "this is userid..........");
//   return new Promise(async (resolve, reject) => {
//     try {
//       let result = await order.aggregate([
//         [

//           {
//             '$match': {
//               'userId': new mongoose.Types.ObjectId(userid)            }
//           },
        
//         {
//           '$unwind': {
//             'path': '$products'
//           }
//         },
//         {
//           '$project': {
//             "_id": 1,
//             "products.res.Productname": 1,
//             "date": 1,
//             "totalAmount": 1,
//           }
//         },
//         {
//           '$unwind':{
//             "path":"$products.res.Productname",
//         }
//       },
//       {
//         '$project': {
//           "_id": 1,
//           "products.res.Productname": 1,
//           "date": 1,
//           "totalAmount": 1,
//         }
//       },
//         ]
//       ]);
//     
//       resolve(result);
//     } catch (error) {
//       console.error(error);
//       reject(error);
//     }
//   });
// }

// orderDetails: (userid) => {
//   console.log(userid, "this is userid..........");
//   return new Promise(async (resolve, reject) => {
//     try {
//       let result = await order.aggregate([
//         {
//           '$match': {
//             'userId': new mongoose.Types.ObjectId(userid)
//           }
//         },
//         {
//           '$unwind': '$products'
//         },
        
//         {
//           '$project': {
//             "_id": 1,
//             "date": 1,
//             "totalAmount": 1,
//             "productName": "$products.res.Productname"
//           }
//         }
//       ]);

//      console.log(result);
//       resolve(result);
//     } catch (error) {
//       console.error(error);
//       reject(error);
//     }
//   });
// }



orderDetails : (uid) => {
  return new Promise((resolve, reject) => {
    order.find({ owner: uid }).then((data) => {
      resolve(data);
    });
  });
},





};






