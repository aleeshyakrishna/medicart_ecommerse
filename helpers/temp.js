
getCartProducts: (userid) => {
 
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
              'res.Quantity': 1,
              'res.MFDate': 1,
              'res.ExpiryDate': 1,
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
  }
  