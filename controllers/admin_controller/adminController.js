const adminHelpers=require("../../helpers/adminHelper");
// const userhelpers = require("../../helpers/userHelper");
const db = require("../../model/user");
const {Product}= require("../../model/product")
const {Category} =require("../../model/category")
const moment = require('moment');
const adminCredential = {
  name: "Puneeth",
  email: "admin@gmail.com",
  password: "123",
};
let adminStatus;
// const multer=require('/multer/multer')
module.exports = {

  adminLogin:(req,res)=>{
      if (req.session.adminloggedIn) {
        console.log(adminloggedIn, "shaksjaksjaslkjaska");
        res.render("admin/admin_dash");
      } else {
        let loginerr = req.session.adminloginErr;
        res.render("admin/admin_login", {
          // layout: "adminLayout",
          adminStatus,
          loginerr,
        });
        req.session.adminloginErr = false;
      }
  },

  postAdminLogin: (req, res) => {
    console.log("post admin ethiiiiiiiiiiiiiiiii");
    if (
      req.body.email == adminCredential.email &&
      req.body.password == adminCredential.password 
    ) {
      req.session.admin = adminCredential;
      req.session.adminIn = true;
      adminStatus = req.session.adminIn;
      console.log(adminStatus, ",poiuytrew");

      res.redirect("/admin/dashboard");
    } else {
      req.session.adminloginErr = true;
      res.redirect("/admin");
    }
  },

  adminLogout: (req, res) => {
    console.log('hello');
    req.session.admin = null;
    adminStatus = false;
    req.session.adminIn = false;
     res.redirect("/admin");
  },

    //users
    getUserlist: (req, res) => {
        try {
            adminHelpers.listUsers().then((user) => {
                console.log(user,"this is users................");
              res.render("admin/admin_user", {user});
            })
        } catch (error) {
            console.log(error.message);
        }
      },

      admindashboard:(req,res)=>{
      res.render('admin/admin_dash')
      },
      blockTheUser: (req, res) => {
        adminHelpers.blockUser(req.params.id)
          .then(() => {
            res.json({ success: true, message: 'User blocked successfully' });
          })
          .catch((error) => {
            res.status(500).json({ success: false, message: 'Error blocking user' });
          });
      },
      
      unblockTheUser: (req, res) => {
        adminHelpers.unblockUser(req.params.id)
          .then(() => {
            res.json({ success: true, message: 'User unblocked successfully' });
          })
          .catch((error) => {
            res.status(500).json({ success: false, message: 'Error unblocking user' });
          });
      },
      

    //category

      getCategory: (req, res) => {
        adminHelpers.viewAddCategory().then((response) => {
          let viewCategory = response;
          res.render("admin/admin_viewCategory", {
            viewCategory,
          });
        });
      },
    
      postCategory: (req, res) => {
        adminHelpers.addCategory(req.body.catname).then((response) => {
            // console.log(req.body,"nameeeeeeeeeeeeeeeeeeeeeeeeeee");
          res.redirect("/admin/add-category");
        });
      },
    
      deleteCategory: (req, res) => {
        adminHelpers.delCategory(req.params.id).then((response) => {
          res.redirect("/admin/admin_viewCategory");
        });
      },

      viewproduct:(req,res)=>{
        adminHelpers.getallproduct().then((response)=>{
        let allproduct=response
        console.log(allproduct,"aaaaaa");
      
            res.render('admin/admin_medicine',{allproduct})
        })
       
      },
       //product
      getaddProduct:(req,res) =>{
        adminHelpers.viewAddCategory().then((availCat)=>{
            console.log(availCat,"in controller/////////////////////////////");
            res.render('admin/admin_addProduct',{
                availCat
            })
        })
      },


      addProducts: (req, res) => {
        let images = [];
      
        console.log("etheeetto");
        if (req.files) {
          images = req.files.map((file) => file.filename);
        }
        console.log("etheee");
        console.log(req.body, "hloooo");
        console.log(images);
      
        try {
          // Format the date
          req.body.date = moment(req.body.mfd).format('YYYY-MM-DD');
      
          adminHelpers.postAddProduct(req.body, images).then((response) => {
            res.redirect('/admin/view-product');
          });
        } catch (error) {
          console.error(error);
          // Handle the error
          res.render('admin/error');
        }
      },
      
    deleteProduct:(req,res)=>{
        let proId=req.params.id
        console.log(proId)
        adminHelpers.deleteProduct(proId).then((response)=>{
          res.redirect('/admin/admin_medicine')
        })
      },

      editProduct: (req, res) => {
        adminHelpers.viewAddCategory().then((response) => {
          var procategory = response;
          adminHelpers.editProduct(req.params.id).then((response) => {
            editproduct = response;
    
            console.log(editproduct);
            console.log(procategory);
            res.render("admin/edit-product", {
              layout: "adminLayout",
              editproduct,
              procategory,
              adminStatus,
            });
          });
        });
      },

      post_EditProduct: async (req, res) => {
        console.log(req.body);
        // console.log(req.params.id, "77777777");
    
        let product = await adminHelper.editProduct(req.params.id);
        //  console.log(product,"900000000000");
        let oldImageArray = product.Image;
        //  console.log(oldImageArray,"oooo");
        editedImageArray = [];
    
        if (req.files.image1) {
          editedImageArray[0] = req.files.image1[0].filename;
        } else {
          editedImageArray[0] = oldImageArray[0];
        }
    
        if (req.files.image2) {
          editedImageArray[1] =  req.files.image2[0].filename;
        } else {
          editedImageArray[1] = oldImageArray[1];
        }
    
        if (req.files.image3) {
          editedImageArray[2] =  req.files.image3[0].filename;
        } else {
          editedImageArray[2] = oldImageArray[2];
        }
    
        if (req.files.image4) {
          editedImageArray[3] = req.files.image4[0].filename;
        } else {
          editedImageArray[3] = oldImageArray[3];
        }
    
        console.log(editedImageArray,"this is edited.............");
    
        adminHelpers
          .postEditProduct(req.params.id, req.body,editedImageArray )
          .then((response) => {
            console.log(response);
            res.redirect("/admin/view-product");
          });
      },

      // editProduct:(async(req,res)=>{
      //   try {
      //     const product = await Product.findById(req.params.productId);
      //     const categories = await Category.find(); // Assuming you have a Category model
      //     res.render('admin/edit-product', { product, categories });
      //   } catch (err) {
      //     // Handle errors
      //   }
      // }),

      // editProduct: async (req, res) => {
      //   try {
      //     const product = await Product.findById(req.params.productId);
      //     const categories = await Category.find(); // Assuming you have a Category model
      //     const products = await Product.find(); // Retrieve other products if needed
          
      //     res.render('admin/edit-product', { product, categories, products });
      //   } catch (err) {
      //     // Handle errors
      //     console.error(err);
      //     res.status(500).send('Internal Server Error');
      //   }
      // },
      
      
      // posteditProduct:(async (req, res) => {
      //   try {
      //     const productId = req.params.productId;
      //     // Update the product in the database with the data from the form
      //     await Product.findByIdAndUpdate(productId, {
      //       dname: req.body.dname,
      //       qty: req.body.qty,
      //       mfd:req.body.mfd,
      //       exd:req.body.exd,
      //       mdes:req.body.mdes,
      //       price:req.body.price,
      //       mimg:req.body.mimg,
      //       cars:req.body.cars
      //     });
      //     res.redirect('/admin/view-products'); // Redirect to a page displaying all products
      //   } catch (err) {
      //     // Handle errors
      //   }
      // }),
      
      
//     addProducts: async (req, res) => {
//   try {
//     console.log("etheee");
//     console.log(req.body, "hloooo");

//     const result = await adminHelpers.viewAddCategory();
//     console.log(result, "kkkkkkkkkkkkkkkkkkkk");

//     const response = await adminHelpers.postAddProduct(req.body);
//     console.log(response, 'tis is');

//     res.render('admin/admin_medicine', { result: response });
//   } catch (error) {
//     console.log(error);
//     res.render('admin/error', { error: 'An error occurred' });
//   }
// }

orderManagement:(req,res)=>{
  res.render('admin/admin_orderManagement')
}


}