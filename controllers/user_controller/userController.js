const adminhelpers=require("../../helpers/adminHelper")
const userhelpers = require("../../helpers/userHelper");
const {user} =require("../../model/user")
const {response} = require("../../app");
const {Cart} =require("../../model/cart");
const userHelper = require("../../helpers/userHelper");

  module.exports = {
 

    getHome:  async (req, res, next) => {
      // res.render('user/index')
      console.log("home page")
      try {
        let user=req.session.user
        console.log(user)
        const prod = await userhelpers.getProducts();
        const cat= await userhelpers.getcategory();
         
        res.render('user/index', {
          products: prod,
          user: user,
          category: cat, // Include category data in the same object
        });
      }
      catch (error) {
        // Handle any errors that occurred
        console.error(error);
      }

    },

    

    showSignup: (req, res) => {
        // let user=req.session.user.username;
        res.render("user/signup", { emailStatus: true });
      },
      // OG
      postSignup: (req, res) => {
        let {name,email,mobile,password,conpassword}=req.body
          


        console.log(req.body, "this is req.body of signup  form");
        userhelpers.doSignUp(req.body).then((response) => {
          console.log(response,"emial ilaaaaaaaaaaaaaaaa");
          // var emailStatus = response.status;
          // if (response) {
          //   console.log('hello');
          //   res.json({success:true})
          // } else {
          //   //res.render("user/signup", { emailStatus });
          // }
          if (response) {
            res.json({ success: true });
            res.render('user/login')
          } else {
            res.json({ success: false });
          }
          
        });
      
      },
      
      showLogin:(req,res) =>{
        if(req.session.loggedIn){
          res.redirect('/')
        }else{
          res.render("user/login",{loginErr:req.session.loginErr})
          req.session.loginErr=true
        }
      },
      
      getForgot:(req,res) =>{
        res.render('user/forgot_password')
      },

      addToCart:(req,res)=>{
        console.log("hereeeeeeeeeeeeeeeeeeeeeeeeeeee");
        // console.log (req.session)
        // // const userId=req.session.user._id
        try {
          let userId=req.session.user._id;
          let proId= req.params.id;
          console.log(proId,userId,"");

          userhelpers.addCart(userId,proId)
          
          
        } catch (error) {
          console.log(error);
        }
      },


   
            
      // sir
      postLogin: (req, res) => {
         userhelpers.dologin(req.body).then((response)=>{
          if(response.status){
            req.session.loggedIn=true
            req.session.user=response.user
            res.redirect('/')
          }else{
            res.redirect('/login')
          }
         })
      },
      
     logout:(req,res)=>{
      // req.session.destroy()
      req.session.loggedIn=false
      req.session.user=null
      res.redirect('/')
     },

      getAccount:(async(req,res)=>{
        let user=req.session.user
        let userId= req.session.user._id

        let order= await userhelpers.orderDetails(userId)
        
        console.log(order,"hhhhhhhhhhhiiiiiiiiiiiiiiiiiiiiiiiiiii");

          res.render("user/account_detail",{user,order})

      }),


      
      getCart:async(req,res)=>{
        let user=req.session.user
        let userId= req.session.user._id
        const products = await userhelpers.getCartProducts(userId);
        let cart =await userhelpers.getCartProducts(userId)
        console.log(cart.products,"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
let total
if(cart){
    total =cart.reduce(
          (result,item)=> result+item.products.quantity*item.res[0].Price,0)
      

}
       
        console.log(products);
        res.render("user/cart",{user,products,total})
      },

     
      changeQuantity: async (req, res) => {
        console.log(req.params.id, "dddddddddddddddd");
        
        let userId= req.session.user._id

        let stock;       
        // stock = response.Quantity
        console.log(req.body, "alalalalalal");
    
        if (req.body.quantity >= stock) {
          console.log("out of stock!");
          res.json({ stock: true });
        } else {
          userhelpers
            .change_Quantity(req.body.sign,req.params.id,userId)
            .then( (response) => {
              // response.total = await userhelpers.getsubTotal(req.session.user._id)
              // console.log(response,"subtotal respoonse................");
              res.json(response);
            })
            .catch((error) => {
              res.status(500);
            });
        }
      },
      
   
      
      Otppage: (req, res) => {
        res.render("user/otp_login", );
        // { otpLoginErr: req.session.userExistErr }
        // req.session.userExistErr = false;
      },
    
      sendOtp: (req, res) => {
        req.session.mobileno = req.body.mobileno;
        userhelpers.findUser(req.body.mobileno).then((user) => {
          if (user) {
            req.session.user = user;
            twilioApi.sendOtp(req.body.mobileno).then((result) => {
              res.json({ status: true });
            });
          } else {
            req.session.userExistErr =
              "The mobile number is not registered with any account";
            res.json({ status: false });
          }
        });
      },
      
      VerifyOtp: (req, res) => {
        console.log(req.body.mobileno, "this is mobile........");
        console.log(req.body.otp, "this  is otp...........");
    
        twilioApi
          .verifyOtp(req.session.mobileno, req.body.otp)
          .then(async (result) => {
            if (result.valid) {
              const User = await user.findOne({ mobile: req.session.mobileno });
              console.log(User);
              if (User) {
                req.session.userIn = User;
                return res.status(200).json("approved");
              }
              res
                .status(400)
                .json({
                  error: true,
                  message: "user not found pleace create an account",
                });
            } else {
              // req.session.otpErr = "Invalid otp.."
              req.session.otpErr = true;
              res
                .status(400)
                .json({ Invaliderror: true, message: "invalid  opt!!" });
    
              // res.redirect('/')
            }
          })
          .catch((err) => {
            console.log("err:", err);
            res.status(500).send({ message: "cant verify the otp...!" });
          });
      },

      getCheckout:async (req,res)=>{
        // console.log(req.body,"this is req.booooooooooooooody");
        let user=req.session.user
        let userid=req.session.user._id
       
        let address= await userhelpers.getAddress(userid)
        let cart =await userhelpers.getCartProducts(userid)
      
      let total

      if(cart){

    total =cart.reduce(
          (result,item)=> result+item.products.quantity*item.res[0].Price,0)
          
}
console.log(total,"toooooooooooooooooooooootal");

        if(!address){
          res.render("user/checkout",{user,cart,total})
          
        }else{
              let add=address.addresses
         
            res.render("user/checkout",{user,add,cart,total})
        }
     
        },

      

      getaddAddress:(req,res)=>{
        let user=req.session.user
        res.render("user/add_address",{user})
      },
      
      addAddress:(req, res) => {
        try {
          
          let userId = req.session.user._id;
          let formData = req.body;
          userhelpers.addUserAddress(userId, formData).then((response) => {
            res.redirect("/checkout");
          });
        } catch (err) {
          console.log(err);
        }
      },

      userAddAddress: async (req, res) => {
        try {
          let userId=req.session.user._id;
          let formData = req.body;
          let mess ="ADDRESS ADDED"
          await userhelpers.updateMessage(req.session.user._id, mess);
    
          await userhelpers.addUserAddress(userId, formData).then((response) => {
            res.redirect("/checkout");
          });
        } catch (err) {
          console.log(err);
        }
      },

      getOrderConfirmed:(req,res)=>{
        let user= req.session.user
        res.render('user/order-placed',{user})
    },

        
    getcheck:async (req,res)=>{
      const user=res.locals.user._id.toString()
      const newAddresses=await findAddress(user) 
      let cart =await userhelpers.getCartProducts(user)
      displayCheckout(user).then(cart=>{
         let cartCount=req.session.NewcartCount
         var wishListCount=req.session.NewWishCount
          res.render('checkout',{layout:false,user,cart})
      })
      
  },


// OG
postcheck:async (req,res)=>{

  let phone = req.session.user.mobile;
  console.log(phone,"ppppppppppppphhhhh");
  const userId=req.session.user._id;
  console.log(userId,"userrrrrrrrrrrrrrrrr");

  let addressId=req.body.userAddress;

  let oneAddress= await userhelpers.getOneAddress(userId,addressId)

 
    let addressDetails = `${oneAddress.name},${oneAddress.city},${oneAddress.state},${oneAddress.zipcode}`;
    console.log('addressDetailsString:', addressDetails);
  
  let allproduct=await userhelpers.productFomCart(userId)

  let Products = allproduct.map(item => item.res);


  let cart =await userhelpers.getCartProducts(userId)

  let total
  
   if(cart){
    total =cart.reduce(
          (result,item)=> result+item.products.quantity*item.res[0].Price,0)
      
        console.log(total);
}

if(req.body['payment-method']==='COD'){

  

  userhelpers.postplaceorder(userId,Products,addressDetails,req.body,total,phone).then(response=>{
res.json('sucesss')
  })


  
}




},



   getSelectAddress:async(req,res)=>{
    let userId=req.session.user._id;
    let address= await userhelpers.getAddress(userId)
    console.log(address,";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;");
    let add=address.addresses
    res.render('user/selectAddress',{user,add})
   },

   search:async(req,res)=>{
    console.log(req.query.search,"........................>>>");
    const searchValue = req.query.search;

    const category= await userhelpers.getcategory();
    await userhelpers
        .search({ search: searchValue }).then((response)=>{
          // console.log(response,"this is response from search...............");
          res.render('user/category_view',{user,category,response})
        })
   },
  categoryproduct:(req,res)=>{
    let user= req.session.user
    userhelpers.categorySearch(req.query.id).then((category)=>{
      userhelpers.getCat(category[0].CategoryName).then((response) => {
      console.log(response,"uuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
      res.render('user/category_view',{user,category,response})
    })
  })
    // console.log(cat);

  },
  // getCategory:(req,res)=>{
  //   console.log(req.params.id,",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
  //   // if(req.session.user._id){
  //      let user= req.session.user
  //     userhelpers.categorySearch(req.params.id).then((response)=>{
  //       // console.log(data,"99999999999999999999");
  //       res.render('user/category_view',{user,category:response})

  //     })
    
  // }
  // changepassword:(req,res)=>{
  //   res.render('/')
  // },

  changePassword:async (req,res)=>{
    console.log("yyyyy");

    // res.render('/changepassword')
    // console.log(req.body.newpass,",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");

    const currentPassword = req.body.pass;
    const newPass = req.body.newpass;
    const confirm = req.body.conf;
    const email = req.session.user.email
    


    console.log(currentPassword,newPass,confirm,email,"::::::::::::::::::::::::::::::>>>>>>>>>>");
    
      try {
        const result = await userhelpers.changePassword( currentPassword,newPass, confirm,email);
    
        if (result.status) {
          // Password changed successfully
          res.redirect('/profile'); // Redirect to the user's profile page or any other desired page
        } else {
          // Password change failed, handle errors accordingly
          res.render('change-password', { error: result.message }); // Render the change password form with an error message
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    },
  




}

