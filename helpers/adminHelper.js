const user = require("../model/user");
const product=require("../model/product")
const category=require("../model/category.js")
const objectId=require('mongodb').ObjectId

module.exports={
listUsers:async()=>{
    try {
        let userData=[]
    return new Promise(async(resolve,reject)=>{
        await user.user.find().exec().then((result)=>{
            userData= result
            
        })
        console.log(userData);
        resolve(userData)
    })
    } catch (error) {
        console.log(error.message ,'erroreyy');
    }
    

},

blockUser: (userId) => {
    return new Promise(async(resolve, reject) => {
      await user.user.updateOne({ _id: userId }, { $set: { blocked: true } })
        .then((data) => {
          console.log('User blocked successfully');
          resolve();
        })
        .catch((error) => {
          console.log('Error blocking user:', error);
          reject(error);
        });
    });
  },
  
  unblockUser: (userId) => {
    return new Promise(async(resolve, reject) => {
      await user.user.updateOne({ _id: userId }, { $set: { blocked: false } })
        .then((data) => {
          console.log('User unblocked successfully');
          resolve();
        })
        .catch((error) => {
          console.log('Error unblocking user:', error);
          reject(error);
        });
    });
  },

  viewAddCategory: ()=>{
    return new Promise(async(resolve,reject)=>{
        await category.category.find().exec().then((response)=>{
            console.log(response,"this is categorieeeeeeeeeeeeeeeee...........");
            resolve(response)
        })
    }) 
},
  
getallproduct:()=>{
  return new Promise((resolve, reject) => {
    product.product.find().exec().then((response)=>{
        console.log(response,"ppppproducts");
        resolve(response)
    })
  })
},
   
  addCategory: (data) => {
    // console.log(data,"helper etheeeeeeeeeeeeeeeee");
    return new Promise(async (resolve, reject) => {
      let existingCat = await category.category.findOne({ CategoryName:data })
      if (existingCat) {
        // console.log(existingCat,"database finding..................");
        resolve(existingCat);
        return;
      }
      const catData = new category.category({ CategoryName: data });
    //   console.log(catData,"kkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
      await catData.save().then((data) => {
        resolve(data);
      });
    });
  },

  delCategory: (delete_id) => {
    console.log(delete_id);
    return new Promise(async (resolve, reject) => {
      try {
        await category.category.deleteOne({ _id: delete_id });
        resolve({ status: 'success', message: 'Category deleted successfully' });
      } catch (error) {
        console.error(error);
        reject({ status: 'error', message: 'Failed to delete category' });
      }
    });
  },
  



postAddProduct: (userData,filename) => {
    
  
    return new Promise((resolve, reject) => {
      mediProducts = new product.product({
        Productname: userData.dname,
        Quantity: userData.qty,
        ProductDescription: userData.mdes,
        MFDate: userData.mfd,
        ExpiryDate: userData.exd,
        Image: filename,
        Price: userData.price,
        Category: userData.category
      });
  
      mediProducts.save().then((data) => {
        resolve(data);
      });
    });
  },

  // deleteProduct:(proId)=>{
  //     return new Promise((resolve,reject)=>{
  //       console.log(proId);
  //       console.log(objectId(proId))
  //       product.product.deleteOne({_id:objectId(proId)}).then((response)=>{
  //         console.log(response);
  //         resolve(response)
  //       })
  //     })
  // },
  
  deleteProduct: (proId) => {
    return new Promise((resolve, reject) => {
      console.log(proId);
      console.log(objectId(proId));
      product.product.removeOne({ _id: objectId(proId) }).then((response) => {
        console.log(response);
        resolve(response);
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    });
  },
  
  
};
